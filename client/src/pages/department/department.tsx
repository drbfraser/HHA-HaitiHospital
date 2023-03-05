import { useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import {
  ENDPOINT_DEPARTMENT_GET_BY_ID,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
} from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET, TOAST_REPORTS_GET } from 'constants/toastErrorMessages';
import { Department as DepartmentModel, EMPTY_DEPARTMENT } from 'constants/interfaces';
import './department_style.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { History } from 'history';
import { userLocale, dateOptions } from 'constants/date';

interface DepartmentProps {}

export const Department = (props: DepartmentProps) => {
  const { t } = useTranslation();
  //   const authState = useAuthState();
  const { deptId } = useParams<{ deptId: string }>();
  const [department, setDepartment] = useState<DepartmentModel>(EMPTY_DEPARTMENT);
  const history: History = useHistory<History>();
  const [dateRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const [reports, setReports] = useState<any[]>([]);

  const getReports = useCallback(async () => {
    const fetchedReports = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_DEPARTMENT(deptId),
      TOAST_REPORTS_GET,
      history,
    );
    setReports(fetchedReports);
  }, [deptId, history]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  useEffect(() => {
    const getDepartmentById = async (id: string) => {
      setDepartment(
        await Api.Get(ENDPOINT_DEPARTMENT_GET_BY_ID(id), TOAST_DEPARTMENT_GET, history),
      );
    };

    try {
      getDepartmentById(deptId);
    } catch (e) {
      history.push('/notFound');
    }
  }, [history, deptId]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />

        <div className="mt-3">
          {/* Department Title */}
          <section>
            <h1 className="text-start">
              {t('departmentPageDepartmentOf')} {department.name}
            </h1>
          </section>

          {/* Nav buttons */}
          <section>
            <div className="row">
              <div className="col-auto">
                <Link to={`/biomechanic`}>
                  <button className="btn btn-dark btn-sm rounded-bill">
                    <div className="lead">{t('departmentPageBiomechanic')}</div>
                  </button>
                </Link>
              </div>

              <div className="col-auto">
                <DatePicker value={dateRange} onChange={setDayRange} />
              </div>
            </div>
          </section>
        </div>

        <table className="table table-hover mt-3">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t('reportsReportId')}</th>
              <th scope="col">{t('reportsSubmissionDate')}</th>
              <th scope="col">{t('reportsUserId')}</th>
              <th scope="col">{t('reportsOptions')}</th>
            </tr>
          </thead>
          <tbody>
            {reports?.map((item, index) => {
              const dateSubmitted = new Date(item.submittedDate);
              return (
                <tr key={item.__id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.reportObject.id}</td>
                  <td>{dateSubmitted.toLocaleDateString(userLocale, dateOptions)}</td>
                  <td>{item.submittedUserId}</td>
                  <td>
                    <Link to={'/report-view/' + item._id} className="btn-link text-decoration-none">
                      {t('reportsOpenReport')}
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </main>
    </div>
  );
};
