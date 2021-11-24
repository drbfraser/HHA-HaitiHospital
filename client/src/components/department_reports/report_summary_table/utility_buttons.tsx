import React from 'react';

import {ElementStyleProps, ReportProps} from 'constants/interfaces';
import Axios from 'axios'

interface UtilityButtonsProps extends ElementStyleProps {
    tickTracker : {[rid: string]: boolean},
    notifyTable() : void,
}

function isShown(tickTracker: {[rid: string]: boolean}) : boolean{
    const values = Object.values(tickTracker);
    return values.includes(true);
}

function aggregateReport(reportArray: Array<Object>) : Object{
    return reportArray;
}

async function delTickedReportFromDb(rid: string) {
    let dbApiToDelRid = `/api/report/delete/${rid}`;
    const res = await Axios.delete(dbApiToDelRid);
}

async function aggTickedReportFromDb(rid: string) {
    let dbApiToAggSingleRid = `/api/report/viewreport/${rid}`;
    const res = await Axios.get(dbApiToAggSingleRid);
    // reportArray.push(res)
    // console.log(report);
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
        Object.keys(tickTracker).forEach((rid) => {
            try{
                if(tickTracker[rid] === true){
                    //aggregate ticked reports from db
                    let singleReport: Object = aggTickedReportFromDb(rid);
                    // let aggTickedReportFromDb(rid).then(()=>{console.log("test")});   
                    
                    // console.log(singleReport)
                    aggregateReportArray.push(singleReport);
                }
            }
            catch(err){
                console.log("Aggregation Error: " + err);
            }
        })
        let objectReportArray: Array<Object> = [];
        Promise.all(aggregateReportArray).then((values)=>{
            objectReportArray = values;
            console.log(objectReportArray)

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