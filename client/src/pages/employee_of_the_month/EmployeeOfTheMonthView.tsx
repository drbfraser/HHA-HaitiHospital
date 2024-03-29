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

  const isNonEmptyObject = (objectName: any) => {
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

  const CarouselIndicators: React.FC = () => (
    <div className="carousel-indicators">
      {new Array(employeesOfTheMonth.length).fill(0).map((_, index) => (
        <button
          key={index}
          type="button"
          data-bs-target="#eotmCarousel"
          data-bs-slide-to={index}
          className="active"
          aria-current="true"
          aria-label={`Slide ${index + 1}`}
        ></button>
      ))}
    </div>
  );

  const CarouselButtonGroup: React.FC = () => (
    <div className="d-flex gap-1">
      <button
        type="button"
        data-bs-target="#eotmCarousel"
        data-bs-slide="prev"
        className="btn btn-outline-dark "
      >
        <i className="bi bi-caret-left" aria-hidden="true"></i>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        type="button"
        data-bs-target="#eotmCarousel"
        data-bs-slide="next"
        className="btn btn-outline-dark"
      >
        <span className="bi bi-caret-right" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  );

  return (
    <Layout title={t('headerEmployeeOfTheMonth')}>
      <div className="d-flex flex-column flex-sm-row gap-1">
        <Link to="/employee-of-the-month/archive" className="mr-2">
          <button type="button" className="btn btn-outline-dark">
            {t('employeeOfTheMonthList')}
          </button>
        </Link>
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
          <Link to="/employee-of-the-month/add" className="">
            <button data-testid="update-eotm-button" type="button" className="btn btn-outline-dark">
              {t('employeeOfTheMonthAdd')}
            </button>
          </Link>
        )}
      </div>
      {employeesOfTheMonth?.length === 0 ? (
        <h2 className="mt-3 fw-bold">{t('employeeOfTheMonthNotFound')}</h2>
      ) : (
        <div>
          <h2 className="mt-3 mb-3 fw-bold">{t('employeeOfTheMonthTitle').concat(title)}</h2>
          <div id="eotmCarousel" className="carousel carousel-dark slide" data-bs-ride="carousel">
            <div className="carousel-inner my-2">
              {employeesOfTheMonth.map((eotm, i) => (
                <div className={`carousel-item ${i == 0 ? 'active' : ''}`} key={i}>
                  <EmployeeOfTheMonthSummary employee={eotm} />
                </div>
              ))}
              {employeesOfTheMonth.length > 1 ? <CarouselIndicators /> : <></>}
            </div>
            {employeesOfTheMonth.length > 1 ? <CarouselButtonGroup /> : <></>}
          </div>
        </div>
      )}
    </Layout>
  );
};
