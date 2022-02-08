import * as React from 'react';
import { useTranslation } from 'react-i18next';
import { Link, useParams, useHistory } from 'react-router-dom';

import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ReportSummary from 'components/report_summary/report_summary';
import { DepartmentName, getDepartmentName, Role } from 'constants/interfaces';
import './department_style.css';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import { useAuthState } from 'Context';

interface DepartmentProps {}

export const Department = (props: DepartmentProps) => {
  const { t } = useTranslation();
  const authState = useAuthState();
  const { deptId } = useParams<{ deptId: string }>();
  const [deptName, setDeptName] = React.useState<DepartmentName>();
  const history = useHistory();
  const [dateRange, setDayRange] = React.useState<DayRange>({
    from: null,
    to: null,
  });


    React.useEffect(() => {
        try {
            const numberId: number = parseInt(deptId);
            const name: DepartmentName = getDepartmentName(numberId);
            setDeptName(name);
        }
        catch (e) {
            history.push("/notFound");
        }

    },[deptId, history])

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />

        <div className="mt-3">
          {/* Department Title */}
          <section>
            <h1 className="text-start">
              {t('departmentPageDepartmentOf')} {deptName}
            </h1>
          </section>

          {/* Nav buttons */}
          <section>
            <div className="row">
              {authState.userDetails.role === Role.HeadOfDepartment &&
              authState.userDetails.department !== deptName ? null : (
                <div className="col-auto">
                  <Link to={`/department/${deptId}/add`}>
                    <button className=" btn btn-dark btn-sm rounded-bill">
                      <div className="lead">{t('departmentPageSubmitData')}</div>
                    </button>
                  </Link>
                </div>
              )}
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

          {/* Department Report Summary */}
          <section>
            <ReportSummary department={deptName} dateRange={dateRange} />
          </section>
        </div>
      </main>
    </div>
  );
};
