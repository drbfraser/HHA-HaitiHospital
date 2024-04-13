import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { History } from 'history';
import Layout from 'components/layout';
import { EmployeeOfTheMonthJson, Role } from '@hha/common';
import { renderBasedOnRole } from 'actions/roleActions';
import { translateMonth } from 'utils/dateUtils';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { getAllEotms, deleteEotm } from 'api/eotm';

export const EmployeeOfTheMonthList = () => {
  const [employeeOfTheMonthList, setEmployeeOfTheMonthList] = useState<EmployeeOfTheMonthJson[]>(
    [],
  );
  const [currentIndex, setCurrentIndex] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const resetDeleteModal = () => {
    setCurrentIndex(null);
    setShowDeleteModal(false);
  };

  const onModalDeleteConfirm = async () => {
    if (currentIndex) {
      await deleteEotmById(currentIndex);
    }
    setEmployeeOfTheMonthList(
      employeeOfTheMonthList.filter((eotm: any) => eotm.id !== currentIndex),
    );
    resetDeleteModal();
  };

  const onDeleteButton = async (event: any, item: any) => {
    event.stopPropagation();
    event.preventDefault();

    setCurrentIndex(item.id);
    setShowDeleteModal(true);
  };

  const deleteEotmById = async (id: string) => {
    deleteEotm(id, resetDeleteModal, history);
  };

  const getEotms = useCallback(async () => {
    const eotms = await getAllEotms(history);
    setEmployeeOfTheMonthList(eotms);
  }, [history]);

  useEffect(() => {
    getEotms();
  }, [getEotms]);

  const columns = useMemo(() => {
    const columns: FilterableColumnDef[] = [
      {
        header: t('employeeOfTheMonthDateAwarded'),
        id: 'awardedMonthYear',
        accessorFn: ({ awardedMonth, awardedYear }) =>
          `${translateMonth(awardedMonth)} ${awardedYear}`,
      },
      {
        header: t('employeeOfTheMonthName'),
        id: 'name',
        accessorKey: 'name',
      },
      {
        header: t('employeeOfTheMonthDepartment'),
        id: 'department',
        accessorFn: ({ department: { name } }) => name,
      },
      {
        header: t('employeeOfTheMonthLastUpdated'),
        id: 'updatedAt',
        accessorFn: ({ updatedAt }) => updatedAt,
      },
    ];

    if (renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector])) {
      columns.push({
        header: 'Action',
        id: 'deleteEotm',
        cell: (row) => {
          const item = row.row.original;

          return (
            <div>
              <Button
                className="text-decoration-none link-secondary"
                variant="link"
                onClick={(event) => {
                  onDeleteButton(event, item);
                }}
              >
                <i className="bi bi-trash"></i>
              </Button>
              <Link
                to={`/employee-of-the-month/update/` + item.id}
                data-testid="update-eotm-button"
                type="button"
                className="text-decoration-none link-secondary"
              >
                <i className="bi bi-pencil"></i>
              </Link>
            </div>
          );
        },
      });
    }
    return columns;
  }, [authState.userDetails.role, t]);

  return (
    <Layout
      showBackButton
      backButtonName="employeeOfTheMonthViewCurrent"
      title={t('headerEmployeeOfTheMonth')}
      additionalButtons={
        <div>
          {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
            <Link to="/employee-of-the-month/add">
              <button
                data-testid="update-eotm-button"
                type="button"
                className="btn btn-outline-dark"
              >
                {t('employeeOfTheMonthAdd')}
              </button>
            </Link>
          )}
        </div>
      }
    >
      <DeleteModal
        dataTestId="confirm-delete-eotm-button"
        show={showDeleteModal}
        itemName={t('headerEmployeeOfTheMonth')}
        onModalClose={resetDeleteModal}
        onModalDelete={onModalDeleteConfirm}
      />
      <FilterableTable
        columns={columns}
        data={employeeOfTheMonthList}
        rowClickHandler={(item) => history.push(`/employee-of-the-month/${item.id}`)}
        enableFilters
        enableGlobalFilter
        enableSorting
      />
    </Layout>
  );
};
