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
import { ENDPOINT_REPORTS } from 'constants/endpoints';
import { TOAST_REPORTS_GET } from 'constants/toastErrorMessages';
import { JsonReportDescriptor } from '@hha/common';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useDepartmentData } from 'hooks';
import { userLocale, dateOptions } from 'constants/date';

const GeneralReports = () => {
  const [dayRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const { t } = useTranslation();
  const history = useHistory<History>();
  const [reports, setReports] = useState<JsonReportDescriptor[]>([]);
  const getReports = useCallback(async () => {
    const fetchedReports: JsonReportDescriptor[] = await Api.Get(
      ENDPOINT_REPORTS,
      TOAST_REPORTS_GET,
      history,
    );
    setReports(fetchedReports);
  }, [history]);
  const { departmentIdKeyMap } = useDepartmentData();
  useEffect(() => {
    getReports();
  }, [getReports]);

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize: number = 10;
  // TODO: add type
  const currentTableData: any[] = useMemo(() => {
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
          <div className="d-flex justify-content-start mt-3 mb-3">
            <Link to="/change-template">
              <button type="button" className="btn btn-outline-dark">
                {t('template.change_template')}
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
                <th scope="col">{t('reportsOptions')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <th scope="row">{reportNumberIndex + index + 1}</th>
                    <td>{item.reportObject.id}</td>
                    <td>{t(departmentIdKeyMap.get(item.departmentId))}</td>
                    <td>
                      {new Date(item.submittedDate).toLocaleDateString(userLocale, dateOptions)}
                    </td>
                    <td>
                      <Link
                        to={'/report-view/' + item._id}
                        className="btn-link text-decoration-none"
                      >
                        {t('reportsOpenReport')}
                      </Link>
                    </td>
                  </tr>
                );
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
