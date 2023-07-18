import { useEffect, useMemo, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory } from 'react-router-dom';
import Pagination from 'components/pagination/Pagination';
import Layout from 'components/layout';
import Api from 'actions/Api';
import {
  ENDPOINT_DEPARTMENT_GET_BY_ID,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
} from 'constants/endpoints';
import { ResponseMessage } from 'utils/response_message';
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
  const history: History = useHistory<History>();
  const { deptId } = useParams<{ deptId: string }>();
  const { t, i18n } = useTranslation();
  const language = i18n.language;

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
  console.log(currentTableData);

  return (
    <div className="department">
      <Layout>
        <div className="mt-3">
          <section>
            <h1 className="text-start">
              {t('departmentPageDepartmentOf')} {department.name}
            </h1>
          </section>
          <section>
            {currentTableData.length > 0 && (
              <div className="row">
                <div className="col-auto">
                  <DatePicker value={dateRange} onChange={setDayRange} />
                </div>
              </div>
            )}
          </section>
        </div>
        {currentTableData.length > 0 ? (
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
                      <Link
                        to={'/report-view/' + item._id}
                        className="btn-link text-decoration-none"
                      >
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
        ) : (
          <div className="h5 text-primary">
            No reports have been submitted yet for the {department.name} department. Click Report
            (on the left) to create a new report.
          </div>
        )}
        <Pagination
          className="pagination-bar"
          currentPage={currentPage}
          onPageChange={(page) => setCurrentPage(page)}
          pageSize={PAGE_SIZE}
          totalCount={reports.length}
        />
      </Layout>
    </div>
  );
};
