// Reference :
// https://kiarash-z.github.io/react-modern-calendar-datepicker/docs/typescript
import 'react-modern-calendar-datepicker/lib/DatePicker.css';

import { Link, useHistory } from 'react-router-dom';
import { getMonthYear, getDate } from 'constants/date';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import Layout from 'components/layout';
import { useTranslation } from 'react-i18next';
import { useDepartmentData } from 'hooks';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Paths } from 'constants/paths';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { Role } from '@hha/common';
import DeleteModal from 'components/popup_modal/DeleteModal';
import DraftIcon from 'components/report/DraftIcon';
import { Row } from '@tanstack/react-table';
import { deleteReport, getAllReports, getReportsByDeptId } from 'api/report';

const GeneralReports = () => {
  const { t, i18n } = useTranslation();
  const authState = useAuthState();
  const history = useHistory<History>();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string | null>(null);
  const [reports, setReports] = useState<IReportObject<any>[]>([]);

  const getReports = useCallback(async () => {
    const reports =
      authState.userDetails.role === Role.User
        ? await getReportsByDeptId(authState.userDetails.department.id, history)
        : await getAllReports(history);

    setReports(reports);
  }, [authState.userDetails, history]);

  useEffect(() => {
    getReports();
  }, [getReports]);

  const deleteReportCallback = () => {
    setReports(reports.filter((item) => item._id !== currentIndex));
    setCurrentIndex(null);
  };

  const deleteAReport = async (id: string) => deleteReport(id, deleteReportCallback, history);

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
    if (currentIndex) {
      await deleteAReport(currentIndex);
    }
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
      cell: (row) => (
        <span>
          {row.getValue().isDraft ? <DraftIcon /> : <></>}
          {row.getValue().reportName}
        </span>
      ),
      accessorFn: (row) => row,
    },
    {
      header: t('reportsDepartment'),
      id: 'departmentName',
      cell: (row) => <span>{t(`departments.${row.getValue()}`)}</span>,
      accessorKey: 'departmentName',
    },
    {
      header: t('reportsMonth'),
      id: 'reportMonth',
      accessorFn: (row) => row.reportMonth,
      cell: (row) => <span>{row.getValue()}</span>,
      filterFn: (row: Row<any>, columnId: string, value: any) => {
        return true;
      },
    },
    {
      header: t('reportsSubmittedBy'),
      id: 'submittedBy',
      accessorKey: 'submittedBy',
    },
    {
      header: t('reportsSubmissionDate'),
      id: 'submittedDate',
      cell: (row) => <span>{row.getValue()}</span>,
      accessorFn: (row) => row.submittedDate,
      filterFn: (row: Row<any>, columnId: string, value: any) => {
        return true;
      },
    },
    {
      header: t('reportsOptions'),
      id: 'Options',
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
                  data-testid="delete-report-button"
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Link
                  title={t('button.edit')}
                  className="text-decoration-none link-secondary"
                  to={Paths.getGeneralReportId(row.getValue()._id)}
                  onClick={(event) => event.stopPropagation()}
                  data-testid="edit-report-button"
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

  const getReportName = (item: any): string => {
    const deptName = departments.departmentIdKeyMap.get(item.departmentId) || 'Unknown';
    const translatedDeptName = t(deptName);
    return `${translatedDeptName} - ${item.submittedBy}`;
  };

  //TODO: Add interface for item
  const gridData = reports.map((item) => ({
    item,
    _id: item._id,
    reportName: getReportName(item),
    departmentName: departments.departmentIdKeyMap.get(item.departmentId),
    submittedDate: getDate(item, i18n.resolvedLanguage),
    submittedBy: item.submittedBy,
    reportMonth: getMonthYear(item, i18n.resolvedLanguage),
    isDraft: item.isDraft,
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
            <button
              className="btn btn-outline-dark"
              type="button"
              data-testid="create-report-button"
            >
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
        <div className="h5 text-primary my-3">{t('noViewableReports')}</div>
      )}
    </Layout>
  );
};

export default GeneralReports;
