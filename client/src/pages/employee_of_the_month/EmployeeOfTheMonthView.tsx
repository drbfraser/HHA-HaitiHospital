import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import {
  EmployeeOfTheMonth,
  EmployeeViewParams,
  EmployeeViewType,
} from 'pages/employee_of_the_month/typing';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { Link, RouteComponentProps } from 'react-router-dom';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { useAuthState } from 'contexts';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translateMonth } from 'utils/dateUtils';

interface Props extends RouteComponentProps<EmployeeViewParams> {}

export const EmployeeOfTheMonthView = (props: Props) => {
  const [employeesOfTheMonth, setEmployeesOfTheMonth] = useState<EmployeeOfTheMonth[]>([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const [params, setParams] = useState<EmployeeViewParams>();

  const isNonEmptyObject = (objectName) => {
    return Object.keys(objectName).length > 0;
  };

  const getEmployeeViewParams = (): EmployeeViewParams => {
    console.log("EE", props.match)

    if (isNonEmptyObject(props.match.params)) {
      const { params } = props.match;
      console.log('FIRST PARAMS', params);
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

  // const { year, month } = getYearMonthObject();

  useEffect(() => {
    setParams(getEmployeeViewParams());
  }, [history]);

  useEffect(() => {
    if (!params) {
      return;
    }
    const controller = new AbortController();

    const endpoint =
      params.type == EmployeeViewType.EotmId
        ? `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${params.eotmId}`
        : `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${params.year}/${params.month}`;

    const getEmployeeOfTheMonth = async () => {
      console.log(
        await Api.Get(endpoint, TOAST_EMPLOYEE_OF_THE_MONTH_GET, history, controller.signal),
      );
      const employeeOfTheMonthArr: EmployeeOfTheMonth[] = await Api.Get(
        endpoint,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET,
        history,
        controller.signal,
      );

      console.log('ARR', employeeOfTheMonthArr);
      if (employeeOfTheMonthArr.length > 0) {
        setEmployeesOfTheMonth(employeeOfTheMonthArr);
      }
    };
    getEmployeeOfTheMonth();
    return () => {
      controller.abort();
    };
  }, [params]);
  return (
    <Layout title={t('headerEmployeeOfTheMonth')}>
      {/* {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) &&
        employeesOfTheMonth && (
          <Link
            to={`/employee-of-the-month/update/${employeesOfTheMonth[0].awardedYear}/${employeeOfTheMonth.awardedMonth}`}
          >
            <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthEdit')}
            </button>
          </Link>
        )} */}
      <Link to="/employee-of-the-month/record" className="pl-3">
        <button type="button" className="btn btn-outline-dark">
          Record
        </button>
      </Link>
      {/* <h2 className="pl-3 mt-3 mb-3 fw-bold">
        {t('employeeOfTheMonthTitle').concat(
          translateMonth(+params.month).concat(' ').concat(params.year.toString()),
        )}
      </h2> */}
      {employeesOfTheMonth.map((eotm, i) => {
        console.log(eotm);
        return <EmployeeOfTheMonthSummary employee={eotm} key={i} />;
      })}
      {!employeesOfTheMonth && <h2>No employee of the month found</h2>}
    </Layout>
  );
};
