import {
  EmployeeOfTheMonth,
  EmployeeViewParams,
  EmployeeViewType,
} from 'pages/employee_of_the_month/typing';
import { Link, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import Api from '../../actions/Api';
import { ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET } from 'constants/endpoints';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { Role } from 'constants/interfaces';
import { TOAST_EMPLOYEE_OF_THE_MONTH_GET_ERROR } from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { translateMonth } from 'utils/dateUtils';
import { useAuthState } from 'contexts';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';

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

  const employeeViewParams: EmployeeViewParams = useMemo(() => {
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

    return getDefaultParams(params);
  }, [params]);

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
  }, [employeeViewParams, history, params]);

  return (
    <Layout title={t('headerEmployeeOfTheMonth')}>
      {employeesOfTheMonth?.length === 0 ? (
        <h2 className="pl-3">{t('employeeOfTheMonthNotFound')}</h2>
      ) : (
        <div className="">
          <h2 className="pl-3 mt-3 mb-3 fw-bold">{t('employeeOfTheMonthTitle').concat(title)}</h2>
          <div
            id="carouselExampleAutoplaying"
            className="carousel carousel-dark slide"
            data-bs-ride="carousel"
          >
            <div className="carousel-inner">
              <div className="carousel-item active">
                <EmployeeOfTheMonthSummary employee={employeesOfTheMonth[0]} />
              </div>

              {employeesOfTheMonth.slice(1).map((eotm, i) => {
                return (
                  <div className="carousel-item">
                    <EmployeeOfTheMonthSummary employee={eotm} key={i} />;
                  </div>
                );
              })}
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleAutoplaying"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      )}
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
    </Layout>
  );
};
