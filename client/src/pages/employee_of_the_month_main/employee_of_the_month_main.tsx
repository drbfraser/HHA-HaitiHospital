import { useEffect, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month_summary/employee_of_the_month_summary';
import Api from '../../actions/Api';
import './employee_of_the_month_main.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import { renderBasedOnRole } from 'actions/roleActions';
import { EmployeeOfTheMonth } from 'pages/employee_of_the_month_form/EmployeeOfTheMonthModel';
import initialEmployeeOfTheMonth from './initialEmployeeOfTheMonth.json';

interface EmployeeOfTheMonthMainProps extends RouteComponentProps {}

export const EmployeeOfTheMonthMain = (props: EmployeeOfTheMonthMainProps) => {
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState<EmployeeOfTheMonth>(
    initialEmployeeOfTheMonth as EmployeeOfTheMonth,
  );
  const authState = useAuthState();
  const ENDPOINT_URL: string = '/api/employee-of-the-month';
  const TOAST_ERROR: string = 'Unable to fetch employee of the month';
  const { t: translateText } = useTranslation();

  const getEmployeeOfTheMonth = async () => {
    setEmployeeOfTheMonth(await Api.Get(ENDPOINT_URL, TOAST_ERROR));
  };

  useEffect(() => {
    getEmployeeOfTheMonth();
  }, []);

  return (
    <div className="employee-of-the-month-main">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
          <div className="d-flex justify-content-start">
            <Link to="/employee-of-the-month/form">
              <button type="button" className="btn btn-outline-dark">
                {translateText('employeeOfTheMonthEdit')}
              </button>
            </Link>
          </div>
        ) : null}

        <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
          <EmployeeOfTheMonthSummary
            employeeOfTheMonth={employeeOfTheMonth}
            history={undefined}
            location={undefined}
            match={undefined}
          />
        </div>
      </main>
    </div>
  );
};
