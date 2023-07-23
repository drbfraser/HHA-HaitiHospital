import { Link, RouteComponentProps, useHistory, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_GET_BY_ID } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_CASESTUDY_GET } from 'constants/toastErrorMessages';
import { useTranslation } from 'react-i18next';

import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month/typing';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';

import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { formatDateString, translateMonth } from 'utils/dateUtils';
import useDepartmentData from 'hooks/useDepartmentData';

interface Props extends RouteComponentProps {}

export const EmployeeOfTheMonthRecord = (props: Props) => {
  const [employeeOfTheMonthList, setEmployeeOfTheMonthList] = useState<EmployeeOfTheMonth[]>([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

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
  const { departmentIdKeyMap } = useDepartmentData();
  console.log('dddd', departmentIdKeyMap);
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
      accessorFn: ({ departmentId }) => departmentIdKeyMap.get(departmentId),
    },
    {
      header: 'Last Updated',
      id: 'updatedAt',
      accessorFn: ({ updatedAt }) => formatDateString(new Date(updatedAt)),
    },
  ];

  return (
    <Layout showBackButton>
      <div>
      {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
        <Link to="/employee-of-the-month/form">
          <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
            {t('employeeOfTheMonthAdd')}
          </button>
        </Link>
      )}
      </div>
      <FilterableTable
        columns={columns}
        data={employeeOfTheMonthList}
        rowClickHandler={(eotm) =>
          history.push(`/employee-of-the-month/${eotm.awardedYear}/${eotm.awardedMonth}`)
        }
        enableFilters={false}
        enableGlobalFilter={false}
        enableSorting={false}
      />
    </Layout>
  );
};
