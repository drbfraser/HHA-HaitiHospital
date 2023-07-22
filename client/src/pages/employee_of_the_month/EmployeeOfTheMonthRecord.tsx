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

  useEffect(() => {
    console.log('list', employeeOfTheMonthList);
  }, [employeeOfTheMonthList]);
  console.log('list', employeeOfTheMonthList);

  const columns: FilterableColumnDef[] = [
    {
      header: 'Employee Name',
      id: 'name',
      accessorKey: 'name',
    },
    {
      header: 'Awarded Month',
      id: 'awardedMonth',
      accessorKey: 'awardedMonth',
    },
    {
      header: 'Awarded Year',
      id: 'awardedYear',
      accessorKey: 'awardedYear',
    },
    {
      header: 'Last Updated',
      id: 'updatedAt',
      accessorKey: 'updatedAt',
    },
  ];

  return (
    <Layout showBackButton>
      <FilterableTable
        columns={columns}
        data={employeeOfTheMonthList}
        enableFilters={false}
        enableGlobalFilter={false}
        enableSorting={false}
      />
    </Layout>
  );
};
