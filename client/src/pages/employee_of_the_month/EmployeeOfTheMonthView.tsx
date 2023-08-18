import { useEffect, useMemo, useState } from 'react';

import Api from '../../actions/Api';
import {
  EmployeeOfTheMonth,
  EmployeeViewParams,
  EmployeeViewType,
} from 'pages/employee_of_the_month/typing';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { Link, RouteComponentProps, useParams } from 'react-router-dom';
import { useAuthState } from 'contexts';
import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR } from 'constants/toastErrorMessages';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { translateMonth } from 'utils/dateUtils';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { renderBasedOnRole } from 'actions/roleActions';

export const EmployeeOfTheMonthView = () => {
  const authState = useAuthState();
  const [employeesOfTheMonth, setEmployeesOfTheMonth] = useState<EmployeeOfTheMonth[]>([]);
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const [title, setTitle] = useState('');
  const params = useParams<EmployeeViewParams>();

  const isNonEmptyObject = (objectName) => {
    return Object.keys(objectName).length > 0;
  };

  const getDefaultParams = (params: EmployeeViewParams): EmployeeViewParams => {
    if (isNonEmptyObject(params)) {
      params.type =
        params!.eotmId.length > 0 ? EmployeeViewType.EotmId : EmployeeViewType.YearMonth;
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

  const employeeViewParams: EmployeeViewParams = useMemo(() => getDefaultParams(params), [params]);

  useEffect(() => {
    if (!isNonEmptyObject(employeeViewParams)) {
      return;
    }
    const controller = new AbortController();

    const endpoint =
      params.type === EmployeeViewType.EotmId
        ? `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${employeeViewParams.eotmId}`
        : `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${employeeViewParams.year}/${employeeViewParams.month}`;

    const getEmployeeOfTheMonth = async () => {
      let employeeOfTheMonth: EmployeeOfTheMonth | EmployeeOfTheMonth[] = await Api.Get(
        endpoint,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR,
        history,
        controller.signal,
      );

      const employeeOfTheMonthArr: EmployeeOfTheMonth[] = [employeeOfTheMonth].flat();

      if (employeeOfTheMonthArr.length > 0 && isNonEmptyObject(employeeOfTheMonthArr[0])) {
        setEmployeesOfTheMonth(employeeOfTheMonthArr);
        const emp = employeeOfTheMonthArr[0];
        const monthYearTitle = translateMonth(+emp.awardedMonth) + ' ' + emp.awardedYear.toString();
        const title =
          employeeViewParams.type === EmployeeViewType.EotmId
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
      <Link to="/employee-of-the-month/archive" className="pl-3 mr-3">
        <button type="button" className="btn btn-outline-dark">
          {t('employeeOfTheMonthArchive')}
        </button>
      </Link>
      {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
        <Link to="/employee-of-the-month/add">
          <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
            {t('employeeOfTheMonthAdd')}
          </button>
        </Link>
      )}
      <h2 className="pl-3 mt-3 mb-3 fw-bold">{t('employeeOfTheMonthTitle').concat(title)}</h2>
      <div className="d-flex flex-column"></div>
      {employeesOfTheMonth?.length == 0 ? (
        <h2 className="pl-3">{t('employeeOfTheMonthNotFound')}</h2>
      ) : (
        employeesOfTheMonth.map((eotm, i) => {
          return <EmployeeOfTheMonthSummary employee={eotm} key={i} />;
        })
      )}
    </Layout>
  );
};