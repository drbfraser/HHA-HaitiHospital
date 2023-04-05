import Layout from 'components/layout';

// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { useCallback, useEffect, useMemo, useState } from 'react';
import './general_reports_styles.css';
import Pagination from 'components/pagination/Pagination';
import Api from 'actions/Api';
import { ENDPOINT_REPORTS } from 'constants/endpoints';
import { ResponseMessage } from 'utils/response_message';
import { JsonReportDescriptor } from '@hha/common';
import { Link, useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
    const controller = new AbortController();
    const fetchedReports: JsonReportDescriptor[] = await Api.Get(
      ENDPOINT_REPORTS,
      ResponseMessage.getMsgFetchReportsFailed(),
      history,
      controller.signal,
    );
    setReports(fetchedReports);
    return () => {
      controller.abort();
    };
  }, [history]);

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
        <Layout>
          <section>
            <DatePicker value={dayRange} onChange={setDayRange} />
            {/* <ReportSummary dateRange={dayRange} /> */}
          </section>
          <div className="d-flex justify-content-start mt-3 mb-3"></div>
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

          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={reports.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </Layout>
      </div>
    </>
  );
};

export default GeneralReports;
