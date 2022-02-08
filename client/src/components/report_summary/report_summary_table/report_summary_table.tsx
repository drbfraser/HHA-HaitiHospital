
import {useEffect, useState} from 'react';

import { Json} from 'constants/interfaces';
import ReportSummaryRow from 'components/report_summary/report_summary_table/report_summary_row';
import AllTick from 'components/report_summary/report_summary_table/all_tick';
import UtilityButtons from 'components/report_summary/report_summary_table/utility_buttons';
import {useTranslation} from "react-i18next";

interface ReportSummaryTableProps{
  reports :Json[],
  refetchReports(): void,
};


const ReportSummaryTable = (props : ReportSummaryTableProps) => {
  const [tickTracker, setTracker] = useState<{[rid : string] : boolean}>({})
  useEffect(() => {
    let trackerTemp: { [rid: string]: boolean } = {};

    props.reports.forEach((report) => {
      trackerTemp[report['_id'] as string] = false;
    });

    setTracker(trackerTemp);
  }, [props.reports]);

  const tickRow = (update: { [rid: string]: boolean }) => {
    const rids = Object.keys(tickTracker);
    let newTracker = { ...tickTracker };

    Object.keys(update).forEach((rid) => {
      if (rids.includes(rid)) newTracker[rid] = update[rid];
      else console.log('Tick non-existing report row');
    });
    setTracker(newTracker);
  };

  const tickAll = (update: boolean) => {
    const newTracker = { ...tickTracker };

    Object.keys(newTracker).forEach((rid) => {
      newTracker[rid] = update;
    });

    setTracker(newTracker);
  };

  const tableStateChange = () => {
    props.refetchReports();
  };

  const {t} = useTranslation();

  return (
    <section>
      <div className="table-responsive-md">
        <table className={'report-summary-table table'}>
          <thead>
            <tr>
              <th className="mx-1" scope="col">
                {t('departmentPageReportName')}
              </th>
              <th className="mx-1" scope="col">
                Department
              </th>
              <th className="mx-1" scope="col">
                {t('departmentPageLastUpdatedOn')}
              </th>
              <th className="mx-1" scope="col">
                {t('departmentPageLastUpdatedUserID')}
              </th>
              <th className="mx-1" scope="col"></th>
              <th className="mx-1" scope="col">
                <AllTick tickTracker={tickTracker} notifyTable={tickAll} />
              </th>
            </tr>
          </thead>

          <tbody>
            {props.reports.map((report, index) => {
              let username = (report['lastUpdatedByUserId'] as Json)['username'] as string;
              let fullName = (report['lastUpdatedByUserId'] as Json)['name'] as string;

              return (
                <ReportSummaryRow
                  key={index}
                  reportId={report['_id'] as string}
                  createdOn={report['createdOn'] as string}
                  deptId={parseInt(report['departmentId'] as string)}
                  lastUpdatedOn={new Date(report['lastUpdatedOn'] as string)}
                  lastUpdatedBy={`${username} / ${fullName}`}
                  isTicked={tickTracker[report['_id'] as string]}
                  notifyTable={tickRow}
                />
              );
            })}
          </tbody>
        </table>
      </div>
      <UtilityButtons tickTracker={tickTracker} notifyTable={tableStateChange} />
    </section>
  );
};

export default ReportSummaryTable;
