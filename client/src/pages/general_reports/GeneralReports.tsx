// Reference :
//https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

import { Link, useHistory } from 'react-router-dom';
import { dateOptions, userLocale } from 'constants/date';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';

import Api from 'actions/Api';
import {
  ENDPOINT_REPORTS,
  ENDPOINT_REPORT_DELETE_BY_ID,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
} from 'constants/endpoints';
import { JsonReportDescriptor } from '@hha/common';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { useTranslation } from 'react-i18next';
import { useDepartmentData } from 'hooks';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Paths } from 'constants/paths';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { Role } from 'constants/interfaces';
import DeleteModal from 'components/popup_modal/DeleteModal';

const GeneralReports = () => {
  const { t } = useTranslation();
  const authState = useAuthState();
  const history = useHistory<History>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [reports, setReports] = useState<any[]>([]);

  const getReports = useCallback(async () => {
    const controller = new AbortController();
    let getReportsEndPoint = ENDPOINT_REPORTS;
    if (authState.userDetails.role === Role.User) {
      getReportsEndPoint = ENDPOINT_REPORTS_GET_BY_DEPARTMENT(authState.userDetails.department.id);
    }
    let fetchedReports: JsonReportDescriptor[] = await Api.Get(
      getReportsEndPoint,
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

  const deleteReportCallback = () => {
    setReports(reports.filter((item) => item._id !== currentIndex));
    setCurrentIndex(null);
  };

  const deleteReport = async (id: string) => {
    await Api.Delete(
      ENDPOINT_REPORT_DELETE_BY_ID(id),
      {},
      deleteReportCallback,
      history,
      ResponseMessage.getMsgDeleteReportFailed(),
      null,
      ResponseMessage.getMsgDeleteReportOk(),
    );
  };

  const onDeleteReport = (event: any, id: string) => {
    event.stopPropagation();
    setCurrentIndex(id);
    setIsDeleteModalOpen(true);
  };

  const onModalClose = () => {
    setCurrentIndex(null);
    setIsDeleteModalOpen(false);
  };

  const onModalDelete = async () => {
    await deleteReport(currentIndex);
    setIsDeleteModalOpen(false);
  };

  const checkUserDepartmentMatchesReportDepartment = (reportDepartmentId: string) => {
    const userDetails = authState.userDetails;
    if (userDetails.role === Role.Admin || userDetails.role === Role.MedicalDirector) {
      return true;
    }
    return userDetails.department.id === reportDepartmentId;
  };

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
          {renderBasedOnRole(authState.userDetails.role, [
            Role.Admin,
            Role.MedicalDirector,
            Role.HeadOfDepartment,
          ]) &&
            checkUserDepartmentMatchesReportDepartment(row.getValue().departmentId) && (
              <div>
                <Button
                  onClick={(event) => onDeleteReport(event, row.getValue()._id)}
                  variant="link"
                  title={t('button.delete')}
                  className="text-decoration-none link-secondary"
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Link
                  title={t('button.edit')}
                  className="text-decoration-none link-secondary"
                  to={Paths.getGeneralReportId(row.getValue()._id)}
                  onClick={(event) => event.stopPropagation()}
                >
                  <i className="bi bi-pencil"></i>
                </Link>
              </div>
            )}
        </>
      ),
      accessorKey: 'item',
      enableSorting: false,
    },
  ];

  const getReportName = (item): string => {
    return `${departments.departmentIdKeyMap.get(item.departmentId)} Report - ${item.submittedBy}`;
  };

  const gridData = reports.map((item) => ({
    item,
    _id: item._id,
    reportName: getReportName(item),
    departmentName: departments.departmentIdKeyMap.get(item.departmentId),
    submittedDate: new Date(item.submittedDate).toLocaleDateString(userLocale, dateOptions),
    submittedBy: item.submittedBy,
  }));

  return (
    <Layout title={t('headerReports')}>
      <DeleteModal
        dataTestId="confirm-delete-general-reports-button"
        show={isDeleteModalOpen}
        itemName={t('item.report')}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
      ></DeleteModal>

      {renderBasedOnRole(authState.userDetails.role, [
        Role.Admin,
        Role.MedicalDirector,
        Role.HeadOfDepartment,
      ]) && (
        <div>
          <Link to="report">
            <button className="btn btn-outline-dark" type="button">
              {t('createNewReport')}
            </button>
          </Link>
        </div>
      )}

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
