import './index.css';
import { Role } from 'constants/interfaces';
import { Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { isUserInDepartment, renderBasedOnRole } from 'actions/roleActions';
import { useAdminToggleState, useAuthState } from 'contexts';
import { Button } from 'react-bootstrap';
import HhaLogo from 'components/hha_logo/Logo';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { i18n } from 'i18next';

const NAV_ITEM_CLASSES = 'nav-link link-light d-flex gap-0 gap-sm-2 w-100';

type SideBarItemProps = {
  path?: string;
  children: ReactNode;
  onClick?: () => void;
};

export const changeLanguage = (ln: string, i18n: i18n) => {
  return () => {
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

const Sidebar = ({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: Dispatch<SetStateAction<boolean>>;
}) => {
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
    localStorage.setItem('isSidebarExpanded', isExpanded.toString());
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
      className={`h-100 bg-dark position-fixed top-0 start-0 d-flex flex-column sidebarDiv ${
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
        ``
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
            {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarHome')}</span>}
          </SidebarItem>

          {renderBasedOnRole(authState.userDetails.role, [
            Role.Admin,
            Role.MedicalDirector,
            Role.HeadOfDepartment,
            Role.User,
          ]) && (
            <SidebarItem path="general-reports">
              <i className={`${iconMargins} bi bi-paperclip`} />
              {isExpanded && <span className={'text-light'}>{t('sidebarReports')}</span>}
              {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarReports')}</span>}
            </SidebarItem>
          )}

          <SidebarItem path="message-board">
            <i className={`${iconMargins} bi bi-chat-right-text-fill`} />
            {isExpanded && (
              <span data-testid="message-board-side-bar" className={'text-light'}>
                {t('sidebarMessageBoard')}
              </span>
            )}
            {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarMessageBoard')}</span>}
          </SidebarItem>
          <SidebarItem path="leaderboard">
            <i className={`${iconMargins} bi bi-bar-chart-fill`} />
            {isExpanded && (
              <span data-testid="leaderboard-side-bar" className={'text-light'}>
                {t('sidebarLeaderBoard')}
              </span>
            )}
            {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarLeaderBoard')}</span>}
          </SidebarItem>
          <SidebarItem path="case-study">
            <i className={`${iconMargins} bi bi-award-fill`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarCaseStudy')}</span>}
            {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarCaseStudy')}</span>}
          </SidebarItem>
          <SidebarItem path="biomechanic">
            <i className={`${iconMargins} bi bi-wrench`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarBioSupport')}</span>}
            {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarBioSupport')}</span>}
          </SidebarItem>
          <SidebarItem path="employee-of-the-month">
            <i className={`${iconMargins} bi bi-star-fill`} />
            {isExpanded && <span className={'text-light'}>{t('sidebarEmployeeOfTheMonth')}</span>}
            {!isExpanded && (
              <span className={'sidebarTooltip'}>{t('sidebarEmployeeOfTheMonth')}</span>
            )}
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
                {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarAdmin')}</span>}
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
                    {isExpanded && <span className={'text-light'}>{t('sidebarUsers')}</span>}
                    {!isExpanded && <span className={'sidebarTooltip'}>{t('sidebarUsers')}</span>}
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
