import React, { useEffect } from 'react';
import { useParams, Link, useHistory } from 'react-router-dom';
import { useState } from 'react';
import Axios from 'axios';

import { getDepartmentName, ReportProps } from 'constants/interfaces';
import ReportDisplay from 'components/report_display/report_display';

import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import './department_report.css'
import {useTranslation} from "react-i18next";
import DbErrorHandler from 'actions/http_error_handler';


interface DepartmentReportProps {
  edit: boolean;
};

interface UrlParams {
    deptId: string;
    id: string;
};

const DepartmentReport = (props : DepartmentReportProps) => {
  const { deptId, id } = useParams<UrlParams>();
  const [ report, setReport] = useState<ReportProps>({});
  const [ csvData, setCsvData ] = useState<Object[]> ([]);
  const history = useHistory();

  const apiSource = Axios.CancelToken.source();
  useEffect(() => {
    console.log(csvData);
  }, [csvData])

  useEffect(() => {
    let data :Object[] = [];
    if (report.formData !== undefined && report.formData !== null) {
        Object.keys(report.formData).forEach((key) => {
            let tempObj: Object = {};
            tempObj[key] = report.formData[key];
            data.push(tempObj)
        })
    }

    setCsvData(data);

  }, [report])
  // Get Report Id when Loaded
  useEffect(() => {
    let isMounted = true;
    async function getReport() {
      const reportsFromServer = await fetchReport();
      if (isMounted)
        setReport(reportsFromServer[0]);
    };
    
    getReport();

    return function cancelReqWhenUnmounted() {
      isMounted = false;
      apiSource.cancel();
    }
  }, []);

  async function fetchReport() {
    const qs = new URLSearchParams("");
    qs.append("departmentId", deptId);
    qs.append("reportId", id);
    let getReportApi = `/api/report/`;
    if (qs.toString().length > 0) {
        getReportApi += `?${qs.toString()}`;
    }

    try {
      const res = await Axios.get(getReportApi, {
        cancelToken: apiSource.token
      });
      return res.data;
    } catch (err) {
      if (Axios.isCancel(err)) {
        console.log(`Info: Cancel subsciption to ${getReportApi} API`, err);
      }
      else { DbErrorHandler(err, history) }
    }
    return {};
  }

  const {t, i18n} = useTranslation();

  return (
    <div className={"department-report"}>
      <SideBar/>

      <main className="container-fluid">
        <Header/>
        <div className='mt-2'>
          {/* Dept Title */}
          <section className='mt-3'>
            <h1 className="lead text-center">{`Department of ${getDepartmentName(parseInt(deptId))}`}</h1>

          </section>


          {/* Report Details */}
          <section className='mt-3'>
            <div className="container w-50">
              {
                (Object.keys(report).length===0 ) ?
                  <h3 className="lead">{t("departmentReportDisplayNoReportFound")}</h3>:
                  <ReportDisplay
                    report = {report.formData as ReportProps || {}}
                    edit = {props.edit}
                  />
              }
            </div>
          </section>

          {/* Utility buttons */}
          {
            (props.edit === true) ?
              <section className='mt-3'>
                <div className='container w-50'>
                  <ul className='row justify-content-md-center'>
                    <li className='col-sm-auto'><button className="">{t("departmentReportDisplaySave")}</button></li>
                    <li className='col-sm-auto'>
                        <button onClick={()=>history.goBack()}>{t("Discard")}</button>
                    </li>
                    <li className='col-sm-auto'><button className="">{t("departmentReportDisplaySubmit")}</button></li>
                  </ul>
                </div>
              </section>
            :
              <section className="mt-3">
                <div className="container w-50 text-center">
                    <button onClick={()=>history.goBack()}>{t("departmentReportDisplayBack")}</button>
                </div>
              </section>
          }

        </div>
      </main>
    </div>
  )
}

export default DepartmentReport;
