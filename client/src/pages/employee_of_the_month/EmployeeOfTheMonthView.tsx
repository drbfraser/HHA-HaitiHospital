import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import {
  EmployeeOfTheMonth,
  EmployeeViewParams,
  EmployeeViewType,
} from 'pages/employee_of_the_month/typing';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR } from 'constants/toastErrorMessages';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translateMonth } from 'utils/dateUtils';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';

interface Props extends RouteComponentProps<EmployeeViewParams> {}

export const EmployeeOfTheMonthView = (props: Props) => {
  const [employeesOfTheMonth, setEmployeesOfTheMonth] = useState<EmployeeOfTheMonth[]>([]);
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const [params, setParams] = useState<EmployeeViewParams>();
  const [title, setTitle] = useState('');

  const isNonEmptyObject = (objectName) => {
    return Object.keys(objectName).length > 0;
  };

  const getEmployeeViewParams = (): EmployeeViewParams => {
    if (isNonEmptyObject(props.match.params)) {
      const { params } = props.match;
      params.type = params.eotmId.length > 0 ? EmployeeViewType.EotmId : EmployeeViewType.YearMonth;
      return params;
    } else {
      const date = new Date();
      return {
        year: date.getFullYear().toString(),
        month: (date.getMonth() + 1).toString(),
        eotmId: '',
        type: EmployeeViewType.YearMonth,
      };
    }
  };

  useEffect(() => {
    setParams(getEmployeeViewParams());
  }, [history]);

  useEffect(() => {
    if (!params) {
      return;
    }
    const controller = new AbortController();

    const endpoint =
      params.type === EmployeeViewType.EotmId
        ? `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${params.eotmId}`
        : `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${params.year}/${params.month}`;

    const getEmployeeOfTheMonth = async () => {
      let employeeOfTheMonth: EmployeeOfTheMonth | EmployeeOfTheMonth[] = await Api.Get(
        endpoint,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
        history,
        controller.signal,
      );

      const employeeOfTheMonthArr: EmployeeOfTheMonth[] = [employeeOfTheMonth].flat();

      if (employeeOfTheMonthArr.length > 0) {
        setEmployeesOfTheMonth(employeeOfTheMonthArr);
        const emp = employeeOfTheMonthArr[0];
        const monthYearTitle = translateMonth(+emp.awardedMonth) + ' ' + emp.awardedYear.toString();
        const title =
          params.type === EmployeeViewType.EotmId
            ? `${emp.name} - ${monthYearTitle}`
            : monthYearTitle;

        setTitle(title);
      }
    };
    getEmployeeOfTheMonth();
    return () => {
      controller.abort();
    };
  }, [params]);

  return (
    <Layout title={t('headerEmployeeOfTheMonth')}>
      <Link to="/employee-of-the-month/record" className="pl-3">
        <button type="button" className="btn btn-outline-dark">
          {t('employeeOfTheMonthRecord')}
        </button>
      </Link>
      <h2 className="pl-3 mt-3 mb-3 fw-bold">{t('employeeOfTheMonthTitle').concat(title)}</h2>
      <div className="d-flex flex-column">
        {employeesOfTheMonth.map((eotm, i) => {
          return <EmployeeOfTheMonthSummary employee={eotm} key={i} />;
        })}
      </div>
      {employeesOfTheMonth?.length == 0 && (
        <h2 className="pl-3">No employee of the month for this month found</h2>
      )}
    </Layout>
  );
};
