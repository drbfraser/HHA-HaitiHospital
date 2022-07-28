import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './general_reports_styles.css';
import Pagination from 'components/pagination/Pagination';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET } from 'constants/endpoints';
import { TOAST_REPORTS_GET } from 'constants/toast_messages';
import { JsonReportDescriptor } from 'common/json_report'
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GeneralReports = () => {
  const [dayRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const { t } = useTranslation();
  const history = useHistory<History>();
  const [reports, setReports] = useState<JsonReportDescriptor[]>([]);
  const getReports = useCallback(async () => {
    const fetchedReports: JsonReportDescriptor[] = await Api.Get(ENDPOINT_REPORTS_GET, TOAST_REPORTS_GET, history);
    setReports(fetchedReports);
  }, [history]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize: number = 10;
  const currentTableData: JsonReportDescriptor[] = useMemo(() => {
    const firstPageIndex: number = (currentPage - 1) * pageSize;
    const lastPageIndex: number = firstPageIndex + pageSize;
    return reports.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, reports]);
  const reportNumberIndex: number = currentPage * pageSize - pageSize;

  return (
    <>
      <div className="general-reports">
        <Sidebar />
        <main>
          <Header />

          <section>
            <DatePicker value={dayRange} onChange={setDayRange} />
            {/* <ReportSummary dateRange={dayRange} /> */}
          </section>
          <div className="d-flex justify-content-start">
            <Link to="/change-template">
              <button type="button" className="btn btn-outline-dark">
                {t('Change template')}
              </button>
            </Link>
          </div>
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t('reportsReportId')}</th>
                <th scope="col">{t('reportsDepartment')}</th>
                <th scope="col">{t('reportsSubmissionDate')}</th>
                <th scope="col">{t('reportsUserId')}</th>
                <th scope="col">{t('reportsOptions')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((item, index) => {
                return (
                  <tr key={item.meta.id}>
                    <th scope="row">{reportNumberIndex + index + 1}</th>
                    <td>{item.meta.id}</td>
                    <td>{t(item.meta.department.name)}</td>
                    <td>{item.meta.submittedDate}</td>
                    <td>{item.meta.submittedUserId}</td>
                    <td>
                      <Link to={"/report-view/" + item.meta.id} className="btn-link text-decoration-none">
                        {t('reportsOpenReport')}
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={reports.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </main>
      </div>
    </>
  );
};

export default GeneralReports;
