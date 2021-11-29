
import React, {useEffect, useState} from 'react';

import { ElementStyleProps, JsonArray, Json} from 'constants/interfaces';
import ReportSummaryRow from 'components/department_reports/report_summary_table/report_summary_row';
import AllTick from 'components/department_reports/report_summary_table/all_tick';
import UtilityButtons from 'components/department_reports/report_summary_table/utility_buttons';
import temp_checklist from '../temp_checklist';
import {useTranslation} from "react-i18next";

interface ReportSummaryTableProps extends ElementStyleProps {
  reports :Json[],
  refetchReports(): void,
};


const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  const [tickTracker, setTracker] = useState<{[rid : string] : boolean}>({})

  useEffect(()=>{

    let trackerTemp : {[rid: string]: boolean} = {};

    props.reports.forEach((report) => {
        trackerTemp[report["_id"] as string] = false;
    })

    setTracker(trackerTemp);

    console.log(props.reports);

  },[props.reports])

  function getClassName() {
    const ogClass="report-summary-table table"
        if (props.classes === undefined)
            return ogClass;
        else
            return props.classes + ' ' +ogClass;
  }

  function tickRow(update : {[rid: string] : boolean}) {
    // console.log("Row ticked", update)
    const rids = Object.keys(tickTracker);
    let newTracker = {...tickTracker};

    Object.keys(update).forEach((rid) => {
        if (rids.includes(rid))
            newTracker[rid] = update[rid];
        else
            console.log("Tick non-existing report row");
    })
    setTracker(newTracker);
  }

  function tickAll(update : boolean) {
    const newTracker = {...tickTracker};
    const rids = Object.keys(tickTracker);

    Object.keys(newTracker).forEach((rid) => {
        newTracker[rid] = update;
    })

    setTracker(newTracker);
  }

  function delReportsHandler() {
    //   console.log("Table notified for delete");
      props.refetchReports();
  }

  const {t, i18n} = useTranslation();

  return (
    <section>
      {/* Table must be wrapped inside table-responsive to be responsive */}
      <div className="table-responsive-md">
        <table className={getClassName()}>
          <thead>
            <tr>
              <th className='mx-1' scope='col'>{t("departmentPageReportID")}</th>
              <th className='mx-1' scope='col'>{t("departmentPageLastUpdatedOn")}</th>
              <th className='mx-1' scope='col'>{t("departmentPageLastUpdatedUserID")}</th>
              <th className='mx-1' scope='col'></th>
              <th className='mx-1' scope='col'>
                <AllTick tickTracker={tickTracker}
                notifyTable = {tickAll}/>
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map((report, index) => (
                <ReportSummaryRow
                    key={index}
                    reportId = {report["_id"] as string}
                    lastUpdatedOn = { new Date(report["lastUpdatedOn"]as string)}
                    lastUpdatedBy = {report["lastUpdatedByUserId"] as string}
                    isTicked = {tickTracker[report["_id"] as string]}
                    notifyTable = {tickRow}
                />))
            }

          </tbody>
        </table>
      </div>
      
      <UtilityButtons 
        tickTracker={tickTracker}
        notifyTable={delReportsHandler}
     />

    </section>
  )
    
}

export default ReportSummaryTable;