import { EmployeeViewParams, EmployeeViewType } from 'pages/employee_of_the_month/typing';
import { Link, useParams } from 'react-router-dom';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { EmployeeOfTheMonthSummary } from 'components/employee_of_the_month/EmployeeOfTheMonthSummary';
import { History } from 'history';
import Layout from 'components/layout';
import { EmployeeOfTheMonthJson, Role } from '@hha/common';
import { renderBasedOnRole } from 'actions/roleActions';
import { translateMonth } from 'utils/dateUtils';
import { useAuthState } from 'contexts';
import { useHistory } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getEotmById } from 'api/eotm';

export const EmployeeOfTheMonthView = () => {
  const authState = useAuthState();
  const [employeesOfTheMonth, setEmployeesOfTheMonth] = useState<EmployeeOfTheMonthJson[]>([]);
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

  const getEotm = useCallback(async () => {
    if (!isNonEmptyObject(employeeViewParams)) {
      return;
    }
    const id =
      params.type === EmployeeViewType.EotmId
        ? employeeViewParams.eotmId
        : `${employeeViewParams.year}/${employeeViewParams.month}`;

    const eotms = await getEotmById(id, history);
    if (eotms.length > 0 && isNonEmptyObject(eotms[0])) {
      setEmployeesOfTheMonth(eotms);
      const emp = eotms[0];
      const monthYearTitle =
        t(translateMonth(+emp.awardedMonth)) + ' ' + emp.awardedYear.toString();
      const title =
        employeeViewParams.type === EmployeeViewType.EotmId
          ? `${emp.name} - ${monthYearTitle}`
          : monthYearTitle;

      setTitle(title);
    }
  }, [params.type, employeeViewParams, t, history]);

  useEffect(() => {
    getEotm();
  }, [getEotm]);

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
          <button type="button" className="btn btn-outline-dark" data-testid="see-past-eotm-button">
            {t('employeeOfTheMonthList')}
          </button>
        </Link>
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
          <Link to="/employee-of-the-month/add" className="">
            <button data-testid="add-eotm-button" type="button" className="btn btn-outline-dark">
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
                <div className={`carousel-item ${i === 0 ? 'active' : ''}`} key={i}>
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
