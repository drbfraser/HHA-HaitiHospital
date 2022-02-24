import Axios from 'axios';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';

interface UtilityButtonsProps {
  tickTracker: { [rid: string]: boolean };
  notifyTable(): void;
}

const isShown = (tickTracker: { [rid: string]: boolean }): boolean => {
  const values = Object.values(tickTracker);
  return values.includes(true);
};

const reportIterator = (report: Object, mergedObject: Object): Object => {
  for (const [key, value] of Object.entries(report)) {
    if (mergedObject[key]) {
      if (
        key !== 'departmentId' &&
        typeof report[key] !== 'string' &&
        typeof report[key] !== 'object'
      ) {
        mergedObject[key] += value;
      } else if (typeof report[key] === 'object') {
        mergedObject[key] = reportIterator(report[key], mergedObject[key]);
      }
    } else {
      if (typeof report[key] === 'object') {
        mergedObject[key] = {};
        mergedObject[key] = report[key];
      } else {
        mergedObject[key] = value;
      }
    }
  }
  return mergedObject;
};

const aggregateReport = (reportArray: Array<Object>): Object => {
  let merged: Object = {};
  let mergedData: Object = {};
  const lastUpdatedOnRange: Array<number> = [];
  const lastUpdatedByUserIdRange: Array<String> = [];

  //assuming that all departments are the same
  const departmentId = reportArray[0]['data']['departmentId'];

  //aggregating all form data together
  reportArray.forEach((reportSingle) => {
    lastUpdatedOnRange.push(Date.parse(reportSingle['data']['lastUpdatedOn']));
    lastUpdatedByUserIdRange.push(reportSingle['data']['lastUpdatedByUserId']);

    reportSingle = reportSingle['data']['formData'];
    reportIterator(reportSingle, mergedData);
  });

  let max: Date = new Date(Math.max(...lastUpdatedOnRange));
  let min: Date = new Date(Math.min(...lastUpdatedOnRange));

  const dateRange: Object = {
    start: min,
    end: max,
  };
  merged = {
    departmentId,
    dateRange,
    lastUpdatedByUserIdRange,
    mergedData,
  };

  return merged;
};

const delTickedReportFromDb = async (rid: string) => {
  let dbApiToDelRid = `/api/report/delete/${rid}`;
  await Axios.delete(dbApiToDelRid);
};

const aggTickedReportFromDb = async (rid: string) => {
  let dbApiToAggSingleRid = `/api/report/viewreport/${rid}`;
  const res = await Axios.get(dbApiToAggSingleRid);
  return res;
};

const UtilityButtons = (props: UtilityButtonsProps) => {
  const { t, i18n } = useTranslation();

  const deleteReports = (tickTracker: { [rid: string]: boolean }) => {
    if (window.confirm('Delete report(s) ?')) {
      Object.keys(tickTracker).forEach((rid) => {
        try {
          if (tickTracker[rid] === true) delTickedReportFromDb(rid);
        } catch (err) {
          toast.error(i18n.t('reportAlertDeleteReportsFailed'));
        }
      });
      props.notifyTable();
      toast.success(i18n.t('reportAlertReportsDeleted'));
    }
  };

  const aggregateReports = (tickTracker: { [rid: string]: boolean }) => {
    let aggregateReportArray: Array<Object> = [];

    Object.keys(tickTracker).forEach((rid) => {
      try {
        if (tickTracker[rid] === true) {
          //aggregate ticked reports from db
          let singleReport: Object = aggTickedReportFromDb(rid);
          aggregateReportArray.push(singleReport);
        }
      } catch (err) {
        console.log('Aggregation Error: ' + err);
      }
    });
    let objectReportArray: Array<Object> = [];

    //Once all the JSON objects are collected and returned by the promise:
    Promise.all(aggregateReportArray)
      .then((values) => {
        objectReportArray = values;
        //TODO: add MSPP general combined model
        let combinedReport = aggregateReport(objectReportArray);
        console.log(combinedReport);
        return combinedReport;
      })
      .catch((err) => 'Aggregation Error: ' + err);
  };

  return (
    <>
      {isShown(props.tickTracker) ? (
        <div className="row justify-content-end">
          <div className="btn-group col-auto">
            <button
              type="button"
              className="btn btn-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              {i18n.t('departmentPageAction')}
            </button>

            <ul className="dropdown-menu">
              <li>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    deleteReports(props.tickTracker);
                  }}
                >
                  {i18n.t('departmentPageDelete')}
                </span>
              </li>
              <li>
                <span
                  className="dropdown-item"
                  onClick={() => {
                    aggregateReports(props.tickTracker);
                  }}
                >
                  {t('departmentPageAccumulate')}
                </span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
};

export default UtilityButtons;
