import { dateOptions, userLocale } from 'constants/date';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { Link, useHistory, useParams } from 'react-router-dom';

import { DepartmentJson as DepartmentModel } from '@hha/common';
import { getDepartmentById } from 'api/department';
import { getReportsByDeptId } from 'api/report';
import Layout from 'components/layout';
import Pagination from 'components/pagination/Pagination';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

export const Department = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const [department, setDepartment] = useState<DepartmentModel>();
  const [reports, setReports] = useState<IReportObject<any>[]>([]);
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
    const reports = await getReportsByDeptId(deptId, history);
    setReports(reports);
  }, [deptId, history]);
  const getDepartment = useCallback(async () => {
    const department = await getDepartmentById(deptId, history);
    setDepartment(department);
  }, [deptId, history]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  useEffect(() => {
    setIsLoading(true);
    getDepartment().then(() => setIsLoading(false));
  }, [getDepartment]);

  if (isLoading) {
    return (
      <Layout title={`${t('headerDepartmentLoading')}`}>
        {/* Could be replaced with a spinner in the future */}
      </Layout>
    );
  }

  return (
    <Layout
      title={`${t('departmentPageDepartmentOf')} ${department?.name ? department.name : 'loading...'}`}
    >
      <div className="mt-3">
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
      ) : (
        <div className="h5 text-primary">
          {`${t('noReportsAvailable')} ${department?.name ? department.name : 'loading...'}. ${t('clickToReport')}`}
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
  );
};
