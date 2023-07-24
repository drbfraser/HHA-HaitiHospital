import { useEffect, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonth, YearMonthParams } from 'pages/employee_of_the_month/typing';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { Link, RouteComponentProps } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { currentYearAndMonth } from 'utils/dateUtils';

interface Props extends RouteComponentProps<YearMonthParams> {}

export const EmployeeOfTheMonthView = (props: Props) => {
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>(null);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const isNonEmptyObject = (objectName) => {
    return Object.keys(objectName).length > 0;
  };

  const getYearMonthObject = () =>
    isNonEmptyObject(props.match.params) ? props.match.params : currentYearAndMonth();

  useEffect(() => {
    const controller = new AbortController();
    const { year, month } = getYearMonthObject();
    const endpoint = `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${year}/${month}`;
    const getEmployeeOfTheMonth = async () => {
      const employeeOfTheMonthInfo = await Api.Get(
        endpoint,
        TOAST_EMPLOYEE_OF_THE_MONTH_GET,
        history,
        controller.signal,
      );

      if (isNonEmptyObject(employeeOfTheMonthInfo)) {
        setEmployeeOfTheMonth(employeeOfTheMonthInfo);
      }
    };
    getEmployeeOfTheMonth();
    return () => {
      controller.abort();
    };
  }, [history]);

  return (
    <Layout title={t('headerEmployeeOfTheMonth')}>
      {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
        <Link to={`/employee-of-the-month/update/2023/4`}>
          <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
            {t('employeeOfTheMonthEdit')}
          </button>
        </Link>
      )}
      <Link to="/employee-of-the-month/record" className="pl-3">
        <button type="button" className="btn btn-outline-dark">
          Record
        </button>
      </Link>
      {employeeOfTheMonth && <EmployeeOfTheMonthSummary employee={employeeOfTheMonth} />}
      {!employeeOfTheMonth && <h2>No employee of the month found</h2>}
    </Layout>
  );
};
