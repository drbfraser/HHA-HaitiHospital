import { useEffect, useRef } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

import { ReportProps } from 'constants/interfaces';
import { getDepartmentName } from 'common/utils/departments';
import { ReportDisplay } from 'components/report_display/report_display';

import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { useTranslation } from 'react-i18next';
import DbErrorHandler from 'actions/http_error_handler';
import { CSVLink } from 'react-csv';
import { PDFExport } from '@progress/kendo-react-pdf';
import './department_report.css';

interface DepartmentReportProps {
  edit: boolean;
}

interface UrlParams {
  deptId: string;
  id: string;
}

const DepartmentReport = (props: DepartmentReportProps) => {
  const { t } = useTranslation();
  const { deptId, id } = useParams<UrlParams>();
  const [report, setReport] = useState<ReportProps>({});
  const [csvData, setCsvData] = useState<Object[]>([]);
  const pdfExportComponent = useRef(null);
  const handleExportWithComponent = () => {
    pdfExportComponent.current.save();
  };
  const history = useHistory();

  useEffect(() => {
    let BreakException = {};
    let data: Object[] = [];
    if (report.formData !== undefined && report.formData !== null) {
      try {
        Object.keys(report.formData).forEach((key) => {
          if (key === 'departmentId') {
            console.log(key);
            let item: Object = {};
            item['Heading'] = key;
            item['Detail'] = report.formData[key];
            data.push(item);
            throw BreakException;
          }
          let reportType = typeof report.formData[key];
          if (reportType === 'number' || reportType === 'string' || reportType === 'boolean') {
            let item: Object = {};
            item['Heading'] = key;
            item['Detail'] = report.formData[key];
            data.push(item);
          } else {
            let objReport: ReportProps = report.formData[key];
            if (objReport !== undefined && objReport !== null) {
              Object.keys(objReport).forEach((key1) => {
                let innerReportType = typeof objReport[key1];
                if (
                  innerReportType === 'number' ||
                  innerReportType === 'string' ||
                  innerReportType === 'boolean'
                ) {
                  let tempKey = key + '_' + key1;
                  let item: Object = {};
                  item['Heading'] = tempKey;
                  item['Detail'] = objReport[key1];
                  data.push(item);
                } else {
                  let innerReport = objReport[key1];
                  if (innerReport !== undefined && innerReport !== null) {
                    Object.keys(innerReport).forEach((key2) => {
                      let tempKey = key + '_' + key1 + '_' + key2;
                      let item: Object = {};
                      item['Heading'] = tempKey;
                      item['Detail'] = innerReport[key2];
                      data.push(item);
                    });
                  }
                }
              });
            }
          }
        });
      } catch (e) {
        if (e !== BreakException) throw e;
      }
    }
    console.log(data);
    setCsvData(data);
  }, [report]);

  // Get Report Id when Loaded
  useEffect(() => {
    let isMounted = true;
    const apiSource = Axios.CancelToken.source();

    async function fetchReport() {
      const qs = new URLSearchParams('');
      qs.append('departmentId', deptId);
      qs.append('reportId', id);
      let getReportApi = `/api/report/`;
      if (qs.toString().length > 0) {
        getReportApi += `?${qs.toString()}`;
      }

      try {
        const res = await Axios.get(getReportApi, {
          cancelToken: apiSource.token,
        });
        return res.data;
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(`Info: Cancel subscription to ${getReportApi} API`, err);
        } else {
          DbErrorHandler(err, history, 'Unable to add department report');
        }
      }
      return {};
    }

    async function getReport() {
      const reportsFromServer = await fetchReport();
      if (isMounted) setReport(reportsFromServer[0]);
    }

    getReport();

    return function cancelReqWhenUnmounted() {
      isMounted = false;
      apiSource.cancel();
    };
  }, [history, deptId, id]);

  return (
    <div className={'department-report'}>
      <SideBar />

      <main className="container-fluid">
        <Header />
        <div className="mt-2">
          {/* Dept Title */}
          <section className="mt-3">
            <h1 className="lead text-center">{`Department of ${getDepartmentName(
              parseInt(deptId),
            )}`}</h1>
          </section>

          {/* Utility buttons */}
          {props.edit === true ? (
            <section className="mt-3">
              <div className="container w-50">
                <ul className="row justify-content-md-center">
                  <li className="col-sm-auto">
                    <button className="">{t('departmentReportDisplaySave')}</button>
                  </li>
                  <li className="col-sm-auto">
                    <button onClick={() => history.goBack()}>{t('Discard')}</button>
                  </li>
                  <li className="col-sm-auto">
                    <button className="">{t('departmentReportDisplaySubmit')}</button>
                  </li>
                </ul>
              </div>
            </section>
          ) : (
            <section className="mt-3">
              <div className="container w-50 text-center">
                <ul className="row justify-content-md-center">
                  <li className="col-sm-auto">
                    <button onClick={() => history.goBack()}>
                      {t('departmentReportDisplayBack')}
                    </button>
                  </li>
                  <li className="col-sm-auto">
                    <CSVLink data={csvData} filename={id}>
                      <button className="" color="primary">
                        {t('departmentReportDisplayDownloadCSV')}
                      </button>
                    </CSVLink>
                  </li>
                  <li className="col-sm-auto">
                    <div className="button-area">
                      {/*<button onClick={toggleShow}>show</button>*/}
                      <button onClick={handleExportWithComponent}>
                        {t('departmentReportDisplayGeneratePDF')}
                      </button>
                    </div>
                  </li>
                </ul>
              </div>
            </section>
          )}

          {/* Report Details */}
          <section className="mt-3" id="report">
            <PDFExport ref={pdfExportComponent} paperSize="A4" fileName={id}>
              <div className="container w-50">
                {Object.keys(report).length === 0 ? (
                  <h3 className="lead">{t('departmentReportDisplayNoReportFound')}</h3>
                ) : (
                  <ReportDisplay
                    report={report.formData as ReportProps}
                    parentKey=""
                    descriptions={(report.formData as ReportProps)['descriptions']}
                    edit={props.edit}
                  />
                )}
              </div>
            </PDFExport>
          </section>
        </div>
      </main>
    </div>
  );
};

export default DepartmentReport;
