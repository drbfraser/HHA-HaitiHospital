import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Pagination from 'components/pagination/Pagination';
import Header from 'components/header/header';
import Api from 'actions/Api';
import {
  ENDPOINT_DEPARTMENT_GET_BY_ID,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
} from 'constants/endpoints';
import { ResponseMessage } from "utils/response_message";
import { Department as DepartmentModel, EMPTY_DEPARTMENT } from 'constants/interfaces';
import './department_style.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { History } from 'history';
import { userLocale, dateOptions } from 'constants/date';

const PAGE_SIZE = 10;

interface DepartmentProps {}

export const Department = (props: DepartmentProps) => {
  const [dateRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const [department, setDepartment] = useState<DepartmentModel>(EMPTY_DEPARTMENT);
  const [reports, setReports] = useState<IReportObject<any>[]>([]);
  //const authState = useAuthState();
  const history: History = useHistory<History>();
  const { deptId } = useParams<{ deptId: string }>();
  const { t } = useTranslation();

  // Pagination variables
  const [currentPage, setCurrentPage] = useState(1);
  const currentTableData: IReportObject<any>[] = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;
    return reports.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, reports]);
  const reportNumberIndex = currentPage * PAGE_SIZE - PAGE_SIZE;

  const getReports = useCallback(async () => {
    const controller = new AbortController();
    const fetchedReports: IReportObject<any>[] = await Api.Get(
      ENDPOINT_REPORTS_GET_BY_DEPARTMENT(deptId),
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    setReports(fetchedReports);
    return () => {
      controller.abort();
    };
  }, [deptId, history]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  useEffect(() => {
    const controller = new AbortController();
    const getDepartmentById = async (id: string) => {
      setDepartment(
        await Api.Get(
          ENDPOINT_DEPARTMENT_GET_BY_ID(id),
          ResponseMessage.getMsgFetchDepartmentFailed(),
          history,
          controller.signal,
        ),
      );
    };

    try {
      getDepartmentById(deptId);
    } catch (e) {
      history.push('/notFound');
    }
    return () => {
      controller.abort();
    };
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
              <th scope="col">{t('reportsSubmittedBy')}</th>
            </tr>
          </thead>
          <tbody>
            {currentTableData.map((item, index) => {
              return (
                <tr key={item._id}>
                  <th scope="row">{reportNumberIndex + index + 1}</th>
                  <td>
                    <Link to={'/report-view/' + item._id} className="btn-link text-decoration-none">
                      {item.reportObject.id}
                    </Link>
                  </td>
                  <td>
                    {item.submittedDate &&
                      new Date(item.submittedDate).toLocaleDateString(userLocale, dateOptions)}
                  </td>
                  <td>{item.submittedBy}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          pageSize={PAGE_SIZE}
          totalCount={reports.length}
        />
      </main>
    </div>
  );
};
