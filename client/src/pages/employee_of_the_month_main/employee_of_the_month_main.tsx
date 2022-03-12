import { useEffect, useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month_summary/employee_of_the_month_summary';
import axios from 'axios';
import { toast } from 'react-toastify';
import './employee_of_the_month_main.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import { renderBasedOnRole } from 'actions/roleActions';

interface EmployeeOfTheMonthMainProps extends RouteComponentProps {}

export const EmployeeOfTheMonthMain = (props: EmployeeOfTheMonthMainProps) => {
  const [employeeOfTheMonth, setEmployeeOfTheMonth] = useState([]);
  const authState = useAuthState();
  const { t: translateText } = useTranslation();

  const getEmployeeOfTheMonth = async () => {
    await axios
      .get('/api/employee-of-the-month')
      .then((response: any) => {
        console.log(response.data);
        setEmployeeOfTheMonth(response.data);
      })
      .catch((err: any) => {
        toast.error('Unable to fetch employee of the month');
      });
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
          <EmployeeOfTheMonthSummary employeeOfTheMonth={employeeOfTheMonth} />
        </div>
      </main>
    </div>
  );
};
