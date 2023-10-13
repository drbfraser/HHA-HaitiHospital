// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { Link, useHistory } from 'react-router-dom';
import { dateOptions, userLocale } from 'constants/date';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_REPORTS } from 'constants/endpoints';
import { JsonReportDescriptor } from '@hha/common';
import Layout from 'components/layout';
import Pagination from 'components/pagination/Pagination';
import { ResponseMessage } from 'utils/response_message';
import { useTranslation } from 'react-i18next';
import { useDepartmentData } from 'hooks';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { event } from 'cypress/types/jquery';

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
  const departments = useDepartmentData();

  let departmentsCheckBoxes = [];
  departments.departmentIdKeyMap.forEach((value: string, key: string) => {
    departmentsCheckBoxes.push({ departmentId: key, departmentName: value });
  });
  const columns: FilterableColumnDef[] = [
    {
      header: t('reportsReportId'),
      id: 'reportId',
      accessorKey: 'reportId',
    },
    {
      header: t('leaderBoardOverviewDepartment'),
      id: 'departmentName',
      accessorKey: 'departmentName',
    },
    {
      header: t('reportsSubmissionDate'),
      id: 'submittedDate',
      accessorKey: 'submittedDate',
    },

    {
      header: t('reportsSubmittedBy'),
      id: 'submittedBy',
      accessorKey: 'submittedBy',
    },
  ];

  const gridDate = currentTableData.map((item) => ({
    reportId: item.reportObject.id,
    departmentName: departments.departmentIdKeyMap.get(item.departmentId),
    submittedDate: new Date(item.submittedDate).toLocaleDateString(userLocale, dateOptions),
    submittedBy: item.submittedBy,
  }));

  return (
    <Layout title={t('headerGeneralReports')}>
      <div>
        <Link to="report">
          <button className="btn btn-outline-dark" type="button">
            {t('createNewReport')}
          </button>
        </Link>
      </div>
      {gridDate.length > 0 ? (
        <FilterableTable
          columns={columns}
          data={gridDate}
          enableFilters
          enableGlobalFilter
          enableSorting
        />
      ) : (
        <div className="h5 text-primary">
          No reports have been submitted yet. Click Report (on the left) to create a new report.
        </div>
      )}
    </Layout>
  );
};

export default GeneralReports;
