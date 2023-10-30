// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

import { Link, useHistory } from 'react-router-dom';
import { dateOptions, userLocale } from 'constants/date';
import { useCallback, useEffect, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_REPORTS } from 'constants/endpoints';
import { JsonReportDescriptor } from '@hha/common';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useTranslation } from 'react-i18next';
import { useDepartmentData } from 'hooks';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Paths } from 'constants/paths';

const GeneralReports = () => {
  const { t } = useTranslation();
  const history = useHistory<History>();
  const [reports, setReports] = useState<any[]>([]);
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

  const departments = useDepartmentData();

  let departmentsCheckBoxes = [];
  departments.departmentIdKeyMap.forEach((value: string, key: string) => {
    departmentsCheckBoxes.push({ departmentId: key, departmentName: value });
  });
  const columns: FilterableColumnDef[] = [
    {
      header: t('reportsReportId'),
      id: 'reportName',
      accessorKey: 'reportName',
    },
    {
      header: t('leaderBoardOverviewDepartment'),
      id: 'departmentName',
      cell: (row) => <span>{t(`departments.${row.getValue()}`)}</span>,
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
    {
      id: 'Options',
      header: t('reportsOptions'),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: (row) => (
        <>
          <Link
            title={t('button.edit')}
            className="text-decoration-none link-secondary"
            to={Paths.getGeneralReportId(row.getValue())}
            onClick={(event) => event.stopPropagation()}
          >
            <i className="bi bi-pencil"></i>
          </Link>
        </>
      ),
      accessorKey: '_id',
      enableSorting: false,
    },
  ];

  const getReportName = (item): string => {
    return `${departments.departmentIdKeyMap.get(item.departmentId)} Report - ${item.submittedBy}`;
  };

  const gridData = reports.map((item) => ({
    _id: item._id,
    reportName: getReportName(item),
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
      {gridData.length > 0 ? (
        <FilterableTable
          columns={columns}
          rowClickHandler={(item) => history.push(`${Paths.getGeneralReportId(item._id)}`)}
          data={gridData}
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
