import './index.css';

import { Department, GeneralDepartment, Role } from 'constants/interfaces';
import { ReactNode, useEffect, useState } from 'react';
import { isUserInDepartment, renderBasedOnRole } from 'actions/roleActions';
import { useAdminToggleState, useAuthState } from 'contexts';

import { Button } from 'react-bootstrap';
import HhaLogo from 'components/hha_logo/Logo';
import { NavLink } from 'react-router-dom';
import { is } from 'cypress/types/bluebird';
import { useDepartmentData } from 'hooks';
import { useTranslation } from 'react-i18next';

const NAV_ITEM_CLASSES = 'nav-link link-light d-flex gap-0 gap-sm-2 w-100';

type SideBarItemProps = {
  path?: string;
  children: ReactNode;
  onClick?: () => void;
};

export const changeLanguage = (ln, i18n) => {
  return () => {
    localStorage.setItem('lang', ln);
    i18n.changeLanguage(ln);
  };
};

const SidebarItem = ({ path, children, onClick }: SideBarItemProps) => {
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
      {path ? (
        <NavLink
          to={`/${path}`}
          className={NAV_ITEM_CLASSES}
          exact
          activeClassName="active"
          {...(active && { style: focusHoverState })}
        >
          {children}
        </NavLink>
      ) : (
        <Button
          className={NAV_ITEM_CLASSES}
          variant="link"
          {...(active && { style: focusHoverState })}
          onClick={onClick}
        >
          {children}
        </Button>
      )}
    </li>
  );
};

const Sidebar = ({ isExpanded, setIsExpanded }) => {
  const { departments } = useDepartmentData();
  const { t, i18n } = useTranslation();
  const authState = useAuthState();

  const languages = [
    { name: t('sidebarEnglish'), code: 'en' },
    { name: t('sidebarFrench'), code: 'fr' },
  ];

  useEffect(() => {
    const matchMedia = window.matchMedia('(max-width: 768px)');

    const windowSizeCallback = () => {
      setIsExpanded((isExpanded) => !matchMedia.matches && isExpanded);
    };

    matchMedia.addEventListener('change', windowSizeCallback);

    windowSizeCallback();
    return () => {
      matchMedia.removeEventListener('change', windowSizeCallback);
    };
  });

  useEffect(() => {
    localStorage.setItem('isSidebarExpanded', isExpanded);
  }, [isExpanded]);

  const renderDeptIfUserInDept = (departmentName: string): boolean => {
    if (authState.userDetails.role === Role.User) {
      return isUserInDepartment(authState.userDetails.department.name, departmentName);
    }
    return true;
  };

  const { adminToggleState: isAdminExpanded, setAdminToggleState: setIsAdminExpanded } =
    useAdminToggleState();

  const iconMargins = isExpanded ? 'ms-2' : 'mx-auto';

  return (
    <div
      className={`h-100 bg-dark position-fixed top-0 start-0 d-flex flex-column ${
        isExpanded ? 'expanded' : 'collapsed'
      }`}
      style={{ zIndex: 1000 }}
    >
      <div>
        <HhaLogo
          className="mx-auto d-flex"
          isExpanded={isExpanded}
          style={{
            height: '100px',
            padding: '1.5rem',
          }}
        />

        <ul className="nav nav-pills flex-column mb-auto p-2">
          <SidebarItem onClick={() => setIsExpanded((isExpanded) => !isExpanded)}>
            <i
              className={`${iconMargins} ms-auto bi bi-chevron-bar-${
                isExpanded ? 'left' : 'right'
              }`}
            />
          </SidebarItem>

          <SidebarItem path="home">
            <i className={`${iconMargins} bi bi-house-door-fill`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarHome')}</span>}
          </SidebarItem>
          <SidebarItem path="message-board">
            <i className={`${iconMargins} bi bi-chat-right-text-fill`} />
            {isExpanded && (
              <span data-testid="message-board-side-bar" className={'text-light'}>
                {t('sidebarMessageBoard')}
              </span>
            )}
          </SidebarItem>
          <SidebarItem path="leaderboard">
            <i className={`${iconMargins} bi bi-bar-chart-fill`} />
            {isExpanded && (
              <span data-testid="leaderboard-side-bar" className={'text-light'}>
                {t('sidebarLeaderBoard')}
              </span>
            )}
          </SidebarItem>
          <SidebarItem path="case-study">
            <i className={`${iconMargins} bi bi-award-fill`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarCaseStudy')}</span>}
          </SidebarItem>
          <SidebarItem path="biomechanic">
            <i className={`${iconMargins} bi bi-wrench`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarBioSupport')}</span>}
          </SidebarItem>
          <SidebarItem path="employee-of-the-month">
            <i className={`${iconMargins} bi bi-star-fill`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarEmployeeOfTheMonth')}</span>}
          </SidebarItem>

          <li className="border-top my-2" key="border-1" />

          {renderBasedOnRole(authState.userDetails.role, [
            Role.Admin,
            Role.MedicalDirector,
            Role.HeadOfDepartment,
          ]) && (
            <SidebarItem path="general-reports">
              <i className={`${iconMargins} bi bi-folder-fill`} />
              {isExpanded && <span className={'text-light'}>{t('sidebarGeneral')}</span>}
            </SidebarItem>
          )}

          {departments &&
            departments
              .filter(
                (d: Department) => renderDeptIfUserInDept(d.name) && d.name !== GeneralDepartment,
              )
              .map((dept: Department) => (
                <SidebarItem path={`department/${dept.id}`} key={dept.id}>
                  <i className={`${iconMargins} bi bi-brightness-high-fill`} />
                  {isExpanded && <span className={'text-light'}>{t(dept.name)}</span>}
                </SidebarItem>
              ))}

          <SidebarItem path="report">
            <i className={`${iconMargins} bi bi-exclamation-square`} />
            {isExpanded && <span className={'text-light'}>Report</span>}
          </SidebarItem>

          <li className="border-top my-2" key="border-2" />
          {renderBasedOnRole(authState.userDetails.role, [Role.Admin]) && (
            <>
              <SidebarItem
                onClick={() => {
                  setIsAdminExpanded((isAdminExpanded) => !isAdminExpanded);
                }}
              >
                <i className={`${iconMargins} bi bi-person-fill`}></i>
                {isExpanded && <span className="text-light">{t('sidebarAdmin')}</span>}
                <i
                  className={`ms-auto ${
                    isAdminExpanded ? 'bi bi-chevron-down' : 'bi bi-chevron-right'
                  }`}
                ></i>
              </SidebarItem>
              <li key="admin_toggle" className={isAdminExpanded ? 'active' : ''}>
                <ul className="nested">
                  <SidebarItem path="admin">
                    <i className={`${iconMargins} bi bi-people-fill`} />
                    {isExpanded && <span className={'text-light'}>{t('sidebarAdmin')}</span>}
                  </SidebarItem>

                  <SidebarItem path="upload-report">
                    <i className={`${iconMargins} bi bi-file-earmark-arrow-up-fill`} />
                    {isExpanded && <span className={'text-light'}>{t('sidebarUploadReport')}</span>}
                  </SidebarItem>

                  <SidebarItem path="update-permissions">
                    <i className={`${iconMargins} bi bi-file-earmark-lock2-fill`} />
                    {isExpanded && <span className={'text-light'}>{t('sidebarPermissions')}</span>}
                  </SidebarItem>
                </ul>
              </li>

              <li className="border-top my-2" key="border-3" />
            </>
          )}

          {languages.map((language) => (
            <SidebarItem key={language.code} onClick={changeLanguage(language.code, i18n)}>
              <i className={`${iconMargins} bi bi-translate text-white`} />
              <span>{isExpanded ? language.name : language.code.toLocaleUpperCase()}</span>
            </SidebarItem>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
