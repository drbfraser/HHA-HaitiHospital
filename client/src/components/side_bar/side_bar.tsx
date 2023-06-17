import { isUserInDepartment, renderBasedOnRole } from 'actions/roleActions';
import HhaLogo from 'components/hha_logo/hha_logo';
import './side_bar.css';
import { Department, GeneralDepartment, Role } from 'constants/interfaces';
import { useAuthState, useAdminToggleState } from 'contexts';
import { useDepartmentData } from 'hooks';
import { ReactNode, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router-dom';
import cn from 'classnames';

interface SidebarProps {}

type SideBarItemProps = { path: string; children: ReactNode };

export const changeLanguage = (ln, i18n) => {
  return () => {
    console.log(`Language changed to ${ln}`);
    localStorage.setItem('lang', ln);
    i18n.changeLanguage(ln);
  };
};

const SidebarItem = ({ path, children }: SideBarItemProps) => {
  const [active, setActive] = useState(false);

  const focusHoverState = {
    backgroundColor: '#687d8f',
    textDecoration: 'none',
  };

  return (
    <li
      key={path}
      onMouseEnter={() => {
        setActive(true);
      }}
      onMouseLeave={() => {
        setActive(false);
      }}
      onFocus={() => {
        setActive(true);
      }}
      onBlur={() => {
        setActive(false);
      }}
    >
      <NavLink
        to={`/${path}`}
        className="nav-link link-light"
        exact
        activeClassName="active"
        {...(active && { style: focusHoverState })}
      >
        {children}
      </NavLink>
    </li>
  );
};
const Sidebar = (props: SidebarProps) => {
  const { departments } = useDepartmentData();
  const { t, i18n } = useTranslation();
  const authState = useAuthState();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const windowSizeCallback = () => {
      setIsMobile(window.matchMedia('(max-width: 700px)').matches);
    };
    window.matchMedia('(max-width: 700px)').addEventListener('change', windowSizeCallback);
    windowSizeCallback();
    return () => {
      window.matchMedia('(max-width: 700px)').removeEventListener('change', windowSizeCallback);
    };
  }, []);

  const renderDeptIfUserInDept = (departmentName: string): boolean => {
    if (authState.userDetails.role === Role.User) {
      return isUserInDepartment(authState.userDetails.department.name, departmentName);
    }
    return true;
  };
  const { adminToggleState, setAdminToggleState } = useAdminToggleState();

  return (
    <div
      className={'h-100 bg-dark flex overflow-auto position-fixed'}
      style={{ width: `${isMobile ? '75px' : '200px'}`, top: 0, left: 0, zIndex: 1 }}
    >
      <div>
        <div className={cn({ 'd-none': isMobile })}>
          <div className="text-center" style={{ width: 190 }}>
            <HhaLogo style={{ width: 150 }} />
          </div>
        </div>

        <ul className="nav nav-pills flex-column mb-auto p-2">
          <SidebarItem path="home">
            <i className="bi bi-house-door-fill me-2" />
            <span className={cn('text-light', { 'd-none': isMobile })}>{t('sidebarHome')}</span>
          </SidebarItem>
          <SidebarItem path="message-board">
            <i className="bi bi-chat-right-text-fill me-2" />
            <span
              data-testid="message-board-side-bar"
              className={cn('text-light', { 'd-none': isMobile })}
            >
              {t('sidebarMessageBoard')}
            </span>
          </SidebarItem>
          <SidebarItem path="leaderboard">
            <i className="bi bi-bar-chart-fill me-2" />
            <span
              data-testid="leaderboard-side-bar"
              className={cn('text-light', { 'd-none': isMobile })}
            >
              {t('sidebarLeaderBoard')}
            </span>
          </SidebarItem>
          <SidebarItem path="case-study">
            <i className="bi bi-award-fill me-2" />
            <span className={cn('text-light', { 'd-none': isMobile })}>
              {t('sidebarCaseStudy')}
            </span>
          </SidebarItem>
          <SidebarItem path="biomechanic">
            <i className="bi bi-wrench me-2" />
            <span className={cn('text-light', { 'd-none': isMobile })}>
              {t('sidebarBioSupport')}
            </span>
          </SidebarItem>
          <SidebarItem path="employee-of-the-month">
            <div style={{ display: 'flex', flex: '1 1 auto' }}>
              <i className="bi bi-star-fill me-2" />
              <span className={cn('text-light', { 'd-none': isMobile })}>
                {t('sidebarEmployeeOfTheMonth')}
              </span>
            </div>
          </SidebarItem>

          <li className="border-top my-2" key="border-1" />

          {renderBasedOnRole(authState.userDetails.role, [
            Role.Admin,
            Role.MedicalDirector,
            Role.HeadOfDepartment,
          ]) && (
            <SidebarItem path="general-reports">
              <i className="bi bi-folder-fill me-2" />
              <span className={cn('text-light', { 'd-none': isMobile })}>
                {t('sidebarGeneral')}
              </span>
            </SidebarItem>
          )}

          {departments?.map((dept: Department, index: number) => {
            const deptName = dept.name;
            const deptId = dept.id;

            if (renderDeptIfUserInDept(deptName) && deptName !== GeneralDepartment)
              return (
                <SidebarItem path={`department/${deptId}`}>
                  <i className="bi bi-brightness-high-fill me-2" />
                  <span className={cn('text-light', { 'd-none': isMobile })}>{t(deptName)}</span>
                </SidebarItem>
              );
            else {
              return null;
            }
          })}

          <SidebarItem path="report">
            <i className="bi bi-exclamation-square me-2" />
            <span className={cn('text-light', { 'd-none': isMobile })}>Report</span>
          </SidebarItem>

          <li className="border-top my-2" key="border-2" />
          {renderBasedOnRole(authState.userDetails.role, [Role.Admin]) && (
            <>
              <li key="admin_toggle" className={adminToggleState ? 'active' : ''}>
                <span
                  className="nav-link link-light"
                  onClick={() => {
                    setAdminToggleState(!adminToggleState);
                  }}
                >
                  <i
                    className={adminToggleState ? 'bi bi-chevron-down' : 'bi bi-chevron-right'}
                  ></i>
                  <span className="text text-light">{t('sidebarAdmin')}</span>
                </span>
                <ul className="nested">
                  <SidebarItem path="admin">
                    <i className="bi bi-exclamation-square me-2" />
                    <span className={cn('text-light', { 'd-none': isMobile })}>
                      {t('sidebarAdmin')}
                    </span>
                  </SidebarItem>

                  <SidebarItem path="upload-report">
                    <i className="bi bi-person-badge-fill me-2" />
                    <span className={cn('text-light', { 'd-none': isMobile })}>
                      {t('sidebarUploadReport')}
                    </span>
                  </SidebarItem>

                  <SidebarItem path="update-permissions">
                    <i className="bi bi-person-badge-fill me-2" />
                    <span className={cn('text-light', { 'd-none': isMobile })}>
                      {t('sidebarPermissions')}
                    </span>
                  </SidebarItem>
                </ul>
              </li>

              <li className="border-top my-2" key="border-3" />
            </>
          )}

          <li className="btn-group-toggle" data-toggle="buttons" key="english">
            <button className={`btn-group-toggle nav-link ${localStorage.getItem("lang") === "en" ? "link-primary" : "link-light"}`} onClick={changeLanguage('en', i18n)}>
              <b>EN</b>&ensp;
              <span className={cn({ 'd-none': isMobile })}>
                {t('sidebarEnglish')}
              </span>
            </button>
          </li>

          <li key="french">
            <button className={`nav-link ${localStorage.getItem("lang") === "fr" ? "link-primary" : "link-light"}`} id="fc" onClick={changeLanguage('fr', i18n)}>
              <b>FR</b>&ensp;
              <span className={cn({ 'd-none': isMobile })}>{t('sidebarFrench')}</span>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
