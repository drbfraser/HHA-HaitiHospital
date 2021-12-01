import React from 'react';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';
import Axios from 'axios'
// import FormEntry from '../../../../../server/src/models/FormEntry';
import {useTranslation} from "react-i18next";

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
            // console.log("EXISTS");
            if(key !== 'departmentId' && typeof(report[key]) !== 'string' && typeof(report[key]) !== 'object'){
                mergedObject[key] += value;
                // console.log(`ADD: ${mergedObject[key]}`);
            }
            else if(typeof(report[key]) === 'object'){
                // console.log("ITERATE");
                // console.log(`-OLD OBJECT: ${key}: ${JSON.stringify(report[key])} +  ${JSON.stringify(mergedObject[key])}`);
                mergedObject[key] = reportIterator(report[key],mergedObject[key]);
                // console.log(`-TOTAL: ${JSON.stringify(mergedObject[key])}`);

                // mergedObject[key] += reportIterator(report[key],mergedObject[key]);
            }
        }
        else{
            // console.log("DOESNT EXIST")
            if(typeof(report[key]) === 'object'){
                // console.log("CREATE OBJ");
                mergedObject[key] = {};
                mergedObject[key] = report[key];
                // console.log(`-NEW OBJECT: ${key}: ${JSON.stringify(mergedObject[key])}`);
            }
            else{
                // console.log("CREATE VAR");
                mergedObject[key] = value;
            }
            // mergedObject[key] = value;
        }

    }
    return mergedObject;
}

function aggregateReport(reportArray: Array<Object>) : Object{
    let merged: Object = {};
    let mergedData: Object = {};
    const lastUpdatedOnRange: Array<number> = [];
    const lastUpdatedByUserIdRange: Array<String> = [];

    //assuming that all departments are the same
    const departmentId = reportArray[0]['data']['departmentId'];
    

    //aggregating all form data together
    reportArray.forEach((reportSingle) => {
        // console.log(reportSingle['data']['lastUpdatedOn'].getTime());
        // console.log(typeof(Date.parse(reportSingle['data']['lastUpdatedOn'])))
        lastUpdatedOnRange.push(Date.parse(reportSingle['data']['lastUpdatedOn']));
        lastUpdatedByUserIdRange.push(reportSingle['data']['lastUpdatedByUserId']);

        reportSingle = reportSingle['data']['formData'];
        reportIterator(reportSingle, mergedData);
        // console.log(reportSingle);
    });

    
    
    let max: Date = new Date(Math.max(...lastUpdatedOnRange));
    let min: Date = new Date(Math.min(...lastUpdatedOnRange));

    // console.log(max,min);
    const dateRange: Object = {
        start: min,
        end: max
    }
    // console.log(max,min);
    // const dateRange: Array<Date> = lastUpdatedOnRange.filter(date => date === min || date === max)
    merged = ({
        departmentId,
        dateRange,
        lastUpdatedByUserIdRange,
        mergedData
    });

    return merged;
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
            // console.log(objectReportArray);
            //TODO: add MSPP general combined model
            let combinedReport = aggregateReport(objectReportArray);
            // console.log("Final Merge:");
            console.log(combinedReport);
            return combinedReport;
        }).catch(err => "Aggregation Error: " + err);
        props.notifyTable()
    }

    const {t, i18n} = useTranslation();

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
            <button className="" onClick = {() => { aggregateReports(props.tickTracker);}}>{t("departmentPageAccumulate")}</button>
            </div>
        </div>
        :
        <div></div>
      }
    </div>
  );
}

export default UtilityButtons;