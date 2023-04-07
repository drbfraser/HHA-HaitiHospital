import { NavLink } from 'react-router-dom';
import HhaLogo from 'components/hha_logo/hha_logo';
import './side_bar.css';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { isUserInDepartment, renderBasedOnRole } from 'actions/roleActions';
import { Role, Department, GeneralDepartment } from 'constants/interfaces';
import { useDepartmentData } from 'hooks';

interface SidebarProps {}

export const changeLanguage = (ln, i18n) => {
  return () => {
    console.log(`Language changed to ${ln}`);
    localStorage.setItem('lang', ln);
    i18n.changeLanguage(ln);
  };
};

const Sidebar = (props: SidebarProps) => {
  const { departments } = useDepartmentData();
  const { t, i18n } = useTranslation();
  const authState = useAuthState();
  const renderDeptIfUserInDept = (departmentName: string): boolean => {
    if (authState.userDetails.role === Role.User) {
      return isUserInDepartment(authState.userDetails.department.name, departmentName);
    }
    return true;
  };

  return (
    <div className={'Sidebar h-100 bg-dark flex overflow-auto'} style={{ width: '200px' }}>
      <div>
        <div className="sidebar_logo">
          <div className="text-center" style={{ width: 190 }}>
            <HhaLogo style={{ width: 150 }} />
          </div>
        </div>

        <ul className="nav nav-pills flex-column mb-auto p-2">
          <li key="home">
            <NavLink to="/home" className="nav-link link-light" exact activeClassName="active">
              <i className="bi bi-house-door-fill me-2" />
              <span className="text text-light">{t('sidebarHome')}</span>
            </NavLink>
          </li>
          <li key="message-board">
            <NavLink
              to="/message-board"
              className="nav-link link-light"
              exact
              activeClassName="active"
            >
              <i className="bi bi-chat-right-text-fill me-2" />
              <span data-testid="message-board-side-bar" className="text text-light">
                {t('sidebarMessageBoard')}
              </span>
            </NavLink>
          </li>
          <li key="leaderboard">
            <NavLink
              to="/leaderboard"
              className="nav-link link-light"
              exact
              activeClassName="active"
            >
              <i className="bi bi-bar-chart-fill me-2" />
              <span data-testid="leaderboard-side-bar" className="text text-light">
                {t('sidebarLeaderBoard')}
              </span>
            </NavLink>
          </li>
          <li key="case-study">
            <NavLink
              to="/case-study"
              className="nav-link link-light"
              exact
              activeClassName="active"
            >
              <i className="bi bi-award-fill me-2" />
              <span className="text text-light">{t('sidebarCaseStudy')}</span>
            </NavLink>
          </li>
          <li key="biomechanic">
            {
              <NavLink
                to="/biomechanic"
                className="nav-link link-light"
                exact
                activeClassName="active"
              >
                <i className="bi bi-wrench me-2" />
                <span className="text text-light">{t('sidebarBioSupport')}</span>
              </NavLink>
            }
          </li>
          <li key="employee-of-the-month">
            {
              <NavLink
                to="/employee-of-the-month"
                className="nav-link link-light"
                exact
                activeClassName="active"
              >
                <div style={{ display: 'flex', flex: '1 1 auto' }}>
                  <i className="bi bi-star-fill me-2" />
                  <span className="text text-light">{t('sidebarEmployeeOfTheMonth')}</span>
                </div>
              </NavLink>
            }
          </li>

          <li className="border-top my-2" key="border-1" />

          {renderBasedOnRole(authState.userDetails.role, [
            Role.Admin,
            Role.MedicalDirector,
            Role.HeadOfDepartment,
          ]) ? (
            <li key='general-reports"'>
              <NavLink
                to="/general-reports"
                className="nav-link link-light"
                exact
                activeClassName="active"
              >
                <i className="bi bi-folder-fill me-2" />
                <span className="text text-light">{t('sidebarGeneral')}</span>
              </NavLink>
            </li>
          ) : null}

          {departments?.map((dept: Department, index: number) => {
            const deptName = dept.name;
            const deptId = dept.id;

            if (renderDeptIfUserInDept(deptName) && deptName !== GeneralDepartment)
              return (
                <li key={'department'.concat(index.toString())}>
                  <NavLink
                    to={`/department/${deptId}`}
                    className="nav-link link-light"
                    exact
                    activeClassName="active"
                  >
                    <i className="bi bi-brightness-high-fill me-2" />
                    <span className="text text-light">{t(deptName)}</span>
                  </NavLink>
                </li>
              );
            else {
              return null;
            }
          })}

          <li key="report">
            <NavLink to="/report" className="nav-link link-light" exact activeClassName="active">
              <i className="bi bi-exclamation-square me-2" />
              <span className="text text-light">Report</span>
            </NavLink>
          </li>

          <li className="border-top my-2" key="border-2" />
          {renderBasedOnRole(authState.userDetails.role, [Role.Admin]) ? (
            <>
              <li key="admin">
                <NavLink to="/admin" className="nav-link link-light" exact activeClassName="active">
                  <i className="bi bi-person-badge-fill me-2" />
                  <span className="text text-light">{t('sidebarAdmin')}</span>
                </NavLink>
              </li>

              <li key="uploadReport">
                <NavLink
                  to="/upload-report"
                  className="nav-link link-light"
                  exact
                  activeClassName="active"
                >
                  <i className="bi bi-person-badge-fill me-2" />
                  <span className="text text-light">{t('sidebarUploadReport')}</span>
                </NavLink>
              </li>
              <li className="border-top my-2" key="border-3" />
            </>
          ) : null}

          <li className="btn-group-toggle" data-toggle="buttons" key="english">
            <button className="nav-link link-light" onClick={changeLanguage('en', i18n)}>
              <i className="bi bi-gear-fill me-2" />
              <span className="text text-light">{t('sidebarEnglish')}</span>
            </button>
          </li>

          <li key="french">
            <button className="nav-link link-light" id="fc" onClick={changeLanguage('fr', i18n)}>
              <i className="bi bi-gear me-2" />
              <span className="text text-light">{t('sidebarFrench')}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
