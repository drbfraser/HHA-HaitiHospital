import React from 'react';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';
import Axios from 'axios'
// import FormEntry from '../../../../../server/src/models/FormEntry';

interface UtilityButtonsProps extends ElementStyleProps {
    tickTracker : {[rid: string]: boolean},
    notifyTable() : void,
}

function isShown(tickTracker: {[rid: string]: boolean}) : boolean{
    const values = Object.values(tickTracker);
    return values.includes(true);
}

function reportIterator(report: Object, mergedObject: Object) : Object {
    for(const [key,value] of Object.entries(report)){
        // console.log(`${key}: ${value}`);
        // console.log(typeof(value));
        if(mergedObject[key]){
            if(key !== 'departmentId' && typeof(report[key]) !== 'string'){
                mergedObject[key] += value;
            }
            if(typeof(mergedObject[key]) === 'object'){
                // mergedObject[key] += reportIterator(report[key],mergedObject[key]);
            }
        }
        else{
            // if(typeof(report[key]) === 'object'){
            //     console.log(report[key]);
            //     console.log('test');
            //     // mergedObject[key] = reportIterator(report[key],mergedObject[key]);
            // }
            // else{
            //     mergedObject[key] = value;
            // }
            mergedObject[key] = value;
        }
    }
    return report;
}

function aggregateReport(reportArray: Array<Object>) : Object{
    let merged: Object = {};
    let mergedData: Object = {};

    reportArray.forEach((reportSingle) => {
        reportSingle = reportSingle['data']['formData'];
        reportIterator(reportSingle, mergedData);
        // console.log(reportSingle);
    });

    // merged = reportArray.reduce((merged,report) => {
    //     console.log(report);
    //     console.log(merged);
    //     for(const[key,value] of Object.entries(report['data']['formData'])){
    //         console.log(`${key}: ${value}`);
    //         if(!merged[key]){
    //             merged[key] = value;
    //         }
    //         else{
    //             if(typeof value == "number"){
    //                 merged[key] += value;
    //             }
    //         }
    //     }
    //     return merged;
    // });

    
    // const mergedForm = new FormEntry({
    //     mergedData
    // });
    return mergedData;
}

async function delTickedReportFromDb(rid: string) {
    let dbApiToDelRid = `/api/report/delete/${rid}`;
    const res = await Axios.delete(dbApiToDelRid);
}

async function aggTickedReportFromDb(rid: string) {
    let dbApiToAggSingleRid = `/api/report/viewreport/${rid}`;
    const res = await Axios.get(dbApiToAggSingleRid);
    // reportArray.push(res);
    // console.log(res);
    return res;
}

async function getDepartmentTemplateFromDb(departmentid: string) {
    let dbApiToAggSingleRid = `/api/report/add/${departmentid}`;
    const res = await Axios.get(dbApiToAggSingleRid);
    // reportArray.push(res);
    // console.log(res);
    return res;
}

const UtilityButtons = (props: UtilityButtonsProps) => {

    function deleteReports(tickTracker: {[rid: string]: boolean}) {
        // console.log("Delete ", tickTracker);
        Object.keys(tickTracker).forEach((rid) => {
            try {
                if (tickTracker[rid] === true)
                    delTickedReportFromDb(rid);
            }
            catch (err) {
                console.log("Something wrong when delete report");
            }
        })
        props.notifyTable();
    }

    function aggregateReports(tickTracker: {[rid: string]: boolean}) {
        let aggregateReportArray: Array<Object> = []
        // let mergeReport: Object = getDepartmentTemplateFromDb("1");
        // aggregateReportArray.push(mergeReport);
        Object.keys(tickTracker).forEach((rid) => {
            try{
                if(tickTracker[rid] === true){
                    //aggregate ticked reports from db
                    let singleReport: Object = aggTickedReportFromDb(rid);
                    // let aggTickedReportFromDb(rid).then(()=>{console.log("test")});   
                    // console.log(singleReport);
                    aggregateReportArray.push(singleReport);
                }
            }
            catch(err){
                console.log("Aggregation Error: " + err);
            }
        })
        let objectReportArray: Array<Object> = [];
        
        //Once all the JSON objects are collected and returned by the promise: 
        Promise.all(aggregateReportArray).then((values)=>{
            objectReportArray = values;
            console.log(objectReportArray);
            //TODO: add MSPP general combined model
            let combinedReport = aggregateReport(objectReportArray);
            console.log("Final Merge:");
            console.log(combinedReport);
        }).catch(err => "Aggregation Error: " + err);
        props.notifyTable()
    }

  return (
    <div>
      {(isShown(props.tickTracker))?
        <div className="row justify-content-end">
            <div className="col-auto">
                <button 
                    className=""
                    onClick = {() => {
                        deleteReports(props.tickTracker);
                    }}
                >
                    Delete
                </button>
            </div>

            <div className="col-auto">
            <button className="" onClick = {() => { aggregateReports(props.tickTracker);}}>Accumulate</button>
            </div>
        </div>
        :
        <div></div>
      }
    </div>
  );
}

export default UtilityButtons;