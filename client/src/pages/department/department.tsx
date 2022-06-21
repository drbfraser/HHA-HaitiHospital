import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_DEPARTMENT_GET_BY_ID } from 'constants/endpoints';
import { TOAST_DEPARTMENT_GET } from 'constants/toast_messages';
import { Department as DepartmentModel, EMPTY_DEPARTMENT } from 'constants/interfaces';
import './department_style.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
// import { useAuthState } from 'contexts';
import { History } from 'history';

interface DepartmentProps {}

export const Department = (props: DepartmentProps) => {
  const { t } = useTranslation();
  //   const authState = useAuthState();
  const { deptId } = useParams<{ deptId: string }>();
  const [department, setDepartment] = React.useState<DepartmentModel>(EMPTY_DEPARTMENT);
  const history: History = useHistory<History>();
  const [dateRange, setDayRange] = React.useState<DayRange>({
    from: null,
    to: null,
  });

  React.useEffect(() => {
    const getDepartmentById = async (id: string) => {
      setDepartment(
        await Api.Get(ENDPOINT_DEPARTMENT_GET_BY_ID(id), TOAST_DEPARTMENT_GET, history),
      );
    };

    try {
      getDepartmentById(deptId);
    } catch (e) {
      history.push('/notFound');
    }
  }, [history, deptId]);

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />

        <div className="mt-3">
          {/* Department Title */}
          <section>
            <h1 className="text-start">
              {t('departmentPageDepartmentOf')} {department.name}
            </h1>
          </section>

          {/* Nav buttons */}
          <section>
            <div className="row">
              <div className="col-auto">
                <Link to={`/biomechanic`}>
                  <button className="btn btn-dark btn-sm rounded-bill">
                    <div className="lead">{t('departmentPageBiomechanic')}</div>
                  </button>
                </Link>
              </div>

              <div className="col-auto">
                <DatePicker value={dateRange} onChange={setDayRange} />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};
