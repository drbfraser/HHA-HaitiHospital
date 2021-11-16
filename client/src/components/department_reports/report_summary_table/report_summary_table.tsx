
import React, {SyntheticEvent, useEffect, useState} from 'react';
import Axios from 'axios';

import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import ReportSummaryRow from 'components/department_reports/report_summary_table/report_summary_row';
import { TickList, TickListData, TickObserver } from 'components/department_reports/report_summary_table/tick_list';
import AllTick from 'components/department_reports/report_summary_table/all_tick';
import UtilityButtons from 'components/department_reports/report_summary_table/utility_buttons';
import temp_checklist from '../temp_checklist';
import {useTranslation} from "react-i18next";

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :ReportProps[], 
  tickModel: TickList,
  updateTickList: (update : {[rid: string] : boolean}) => void, 
};



const ReportSummaryTable = (props : ReportSummaryTableProps) => {

//   function trackRowTick(tickedRow : {[rid: string] : boolean}): void {
//     console.log("trackRowTick()");

//     props.updateTickList(tickedRow);
//   }

//   function trackAllTick(isTicked : boolean) {
//     let updateData = {};

//     if (isTicked === true)
//         props.reports.forEach((report) => updateData[report._id as string] = true)
//     else
//         props.reports.forEach((report) => updateData[report._id as string] = false)

//     console.log("All Tick Update: ", updateData);

//     props.updateTickList(updateData);
//   }

  function getClassName(): string {
    if (props.classes === undefined) 
      return "table";
    else 
      return `table ${props.classes} `
  }

  function delReports() {
    // console.log("delReport() ", props.tickModel.getTickedRids());

    // props.tickModel.getTickedRids().forEach((rid) => {
    //     try {
    //         console.log('Delete rid :', rid);
    //         delTickedReportFromDb(rid);
    //     }
    //     catch (err) {
    //         console.log(err);
    //     }
    // })

//     // update react state
//     let newTicks = props.tickModel.getRecords();
//     let toDelRids = props.tickModel.getTickedRids();
//     for (let rid of toDelRids)
//         delete newTicks[rid];
    
//     props.updateTickList(newTicks);
    try {
        delTickedReportFromDb(temp_checklist[0]);
    }
    catch (err) {
        console.log(err);
    }
  }

  async function delTickedReportFromDb(rid: string) {
    let dbApiToDelRid = `/api/report/delete/${rid}`;
    const res = await Axios.delete(dbApiToDelRid);
  }

  const {t, i18n} = useTranslation();

  return (
    <section>
      <div className="table-responsive-md">
        <table className={getClassName()}>
          <thead>
            <tr>
              <th scope='col'>{t("departmentPageReportID")}</th>
              <th scope='col'>{t("departmentPageLastUpdatedOn")}</th>
              <th scope='col'>{t("departmentPageLastUpdatedUserID")}</th>
              <th scope='col'/>
              <th scope='col'>
                {/* {<AllTick tickList={props.tickModel}
                    notifyTable={trackAllTick}/>}   */}
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map(
              (report, index)=> 
              (<ReportSummaryRow 
                key={report._id as string} 
                reportId={report._id as string} 
                lastUpdatedOn={report.lastUpdatedOn as string}
                lastUpdatedBy={report.lastUpdatedByUserId as number}
                // notifyTable={trackRowTick}
                // isTicked={props.tickModel.isTickedRid(report._id as string)}
                tickModel = {props.tickModel}
                />)
            )}
          </tbody>
        </table>
      </div>
      
      <UtilityButtons 
        ticks={props.tickModel} 
        reports={props.reports}
        notifyTable={delReports}
     />

    </section>
  )
    
}

export default ReportSummaryTable;