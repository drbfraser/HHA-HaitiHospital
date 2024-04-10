import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { Button } from 'react-bootstrap';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID } from 'constants/endpoints';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month/typing';
import { History } from 'history';
import Layout from 'components/layout';
import { ResponseMessage } from 'utils/response_message';
import { Role } from '@hha/common';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { translateMonth } from 'utils/dateUtils';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { toI18nDateString } from 'constants/date';

export const EmployeeOfTheMonthList = () => {
  const [employeeOfTheMonthList, setEmployeeOfTheMonthList] = useState<EmployeeOfTheMonth[]>([]);
  const [currentIndex, setCurrentIndex] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const deleteEotm = async (id: string) => {
    await Api.Delete(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID(id),
      {},
      resetDeleteModal,
      history,
      ResponseMessage.getMsgDeleteEotmFailed(),
      undefined,
      ResponseMessage.getMsgDeleteEotmFailed(),
    );
  };

  const resetDeleteModal = () => {
    setCurrentIndex(null);
    setShowDeleteModal(false);
  };

  const onModalDeleteConfirm = async () => {
    if (currentIndex) {
      await deleteEotm(currentIndex);
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

  useEffect(() => {
    const fetchEmployeeOfTheMonths = async (controller: AbortController) => {
      const data = await Api.Get(
        ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
        history,
        controller.signal,
      );
      setEmployeeOfTheMonthList(data);
    };

    const controller = new AbortController();

    fetchEmployeeOfTheMonths(controller);
    return () => {
      controller.abort();
    };
  }, [history]);

  const columns = useMemo(() => {
    const columns: FilterableColumnDef[] = [
      {
        header: t('employeeOfTheMonthDateAwarded'),
        id: 'awardedMonthYear',
        cell: (row) => {
          const { awardedMonth, awardedYear } = row.row.original;
          return `${t(translateMonth(awardedMonth))} ${awardedYear}`;
        },
        accessorFn: (row) => `${t(translateMonth(row.awardedMonth))} ${row.awardedYear}`,
      },
      {
        header: t('employeeOfTheMonthName'),
        id: 'name',
        accessorKey: 'name',
      },
      {
        header: t('employeeOfTheMonthDepartment'),
        id: 'department',
        cell: (row) => t(row.row.original.department.name),
        accessorFn: (row) => t(row.department.name),
      },
      {
        header: t('employeeOfTheMonthLastUpdated'),
        id: 'updatedAt',
        cell: (row) => toI18nDateString(row.row.original.updatedAt, i18n.resolvedLanguage),
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
