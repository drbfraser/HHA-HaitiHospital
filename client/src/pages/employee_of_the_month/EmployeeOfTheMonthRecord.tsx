import { Link, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_CASESTUDY_GET } from 'constants/toastErrorMessages';
import { useTranslation } from 'react-i18next';

import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month/typing';
import { toast } from 'react-toastify';

import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { formatDateString, translateMonth } from 'utils/dateUtils';
import useDepartmentData from 'hooks/useDepartmentData';
import { Button } from 'react-bootstrap';
import DeleteModal from 'components/popup_modal/DeleteModal';


interface Props extends RouteComponentProps { }

export const EmployeeOfTheMonthRecord = (props: Props) => {
  const [employeeOfTheMonthList, setEmployeeOfTheMonthList] = useState<EmployeeOfTheMonth[]>([]);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const deleteEotm = async (id: string) => {
    await Api.Delete(
      ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID(id),
      {},
      () => {
        toast.success('Employee of the month deleted!');
      },
      TOAST_EMPLOYEE_OF_THE_MONTH_GET,
      history,
    );
  };

  const resetDeleteModal = () => {
    setCurrentIndex(null);
    setShowDeleteModal(false);
  };
  

  const onModalDeleteConfirm = async (id: string) => {
    await deleteEotm(id);
    setEmployeeOfTheMonthList(employeeOfTheMonthList.filter((eotm: any) => eotm.id !== id));
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
        TOAST_CASESTUDY_GET,
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
        header: 'Awarded Month Year',
        id: 'awardedMonthYear',
        accessorFn: ({ awardedMonth, awardedYear }) =>
          `${translateMonth(awardedMonth)} ${awardedYear}`,
      },
      {
        header: 'Employee Name',
        id: 'name',
        accessorKey: 'name',
      },
      {
        header: 'Department',
        id: 'department',
        accessorFn: ({ department: { name } }) => name,
      },
      {
        header: 'Last Updated',
        id: 'updatedAt',
        accessorFn: ({ updatedAt }) => updatedAt,
      },
    ];

    if (renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector])) {
      columns.push(
        {
          header: '',
          id: 'deleteEotm',
          cell: (row) => {
            const item = row.row.original;

            return (
              <Button
                data-testid="delete-case-study-button"
                className="text-decoration-none link-secondary"
                variant="link"
                onClick={(event) => {
                  onDeleteButton(event, item);
                }}
              >
                <i className="bi bi-trash"></i>
              </Button>
            );
          },
        },
      )
    }
    return columns;
  }, [authState.userDetails.role, history, t]);

  return (
    <Layout showBackButton>
      <DeleteModal
        dataTestId="confirm-delete-eotm-button"
        currentItem={currentIndex}
        show={showDeleteModal}
        item={`employee of the month`}
        onModalClose={resetDeleteModal}
        onModalDelete={onModalDeleteConfirm}
        history={history}
        location={undefined}
        match={undefined}
      />
      <div>
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
          <Link to="/employee-of-the-month/add">
            <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthAdd')}
            </button>
          </Link>
        )}
      </div>
      <FilterableTable
        columns={columns}
        data={employeeOfTheMonthList}
        rowClickHandler={(row) =>
          history.push(`/employee-of-the-month/${row.id}`)
        }
        enableFilters={false}
        enableGlobalFilter={false}
        enableSorting={false}
      />
    </Layout>
  );
};
