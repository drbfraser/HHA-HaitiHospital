import Header from 'components/header/header';
import Sidebar from 'components/side_bar/side_bar';

// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { useEffect, useState } from 'react';
import './general_reports_styles.css';
import { Pagination } from 'react-bootstrap';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS_GET } from 'constants/endpoints';
import { TOAST_REPORTS_GET } from 'constants/toast_messages';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const GeneralReports = () => {
  const [dayRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const { t } = useTranslation();
  const history = useHistory<History>();
  const [reports, setReports] = useState([]);

  const getReports = async () => {
    const fetchedReports = await Api.Get(ENDPOINT_REPORTS_GET, TOAST_REPORTS_GET, history);
    setReports(fetchedReports);
  }

  useEffect(() => {
    getReports();
  }, [reports]);

  // // Pagination
  // const [currentPage, setCurrentPage] = useState(1);
  // const pageSize: number = 10;
  // const currentTableData = useMemo(() => {
  //   const firstPageIndex = (currentPage - 1) * pageSize;
  //   const lastPageIndex = firstPageIndex + pageSize;
  //   return caseStudies.slice(firstPageIndex, lastPageIndex);
  // }, [currentPage, caseStudies]);
  // const caseStudyNumberIndex = currentPage * pageSize - pageSize;

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
              {reports.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.meta.id}</td>
                    <td>{t(item.meta.department.name)}</td>
                    <td>{item.meta.submittedDate}</td>
                    <td>{item.meta.submittedUserId}</td>
                    <td>
                      <Link to="/general-reports">
                        <button type="button" className="btn btn-link text-decoration-none">
                          {t('Open Report')}
                        </button>
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>

          {/* <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={caseStudies.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          /> */}
        </main>
      </div>
    </>
  );
};

export default GeneralReports;
