import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Api from 'actions/Api';
import { ENDPOINT_ADMIN_ME } from 'constants/endpoints';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';
import { UserDetails } from 'constants/interfaces';
import { logOutUser } from '../../actions/authActions';
import { useAuthDispatch } from '../../contexts';
import { useTranslation } from 'react-i18next';

interface HeaderViewProps {
  user: UserDetails;
  title?: string;
}

const HeaderView = ({ user, title = '' }: HeaderViewProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const department =
    user.department.name === undefined && user.role === undefined
      ? ''
      : `- ${user.department.name !== undefined ? user.department.name : user.role}`;

  if (title) {
    return (
      <h2 data-testid="home-header" className="text-secondary">
        {title}
      </h2>
    );
  } else if (location.pathname.slice(1) === 'home') {
    return (
      <h2 data-testid="home-header" className="text-secondary">{`${t(
        'headerOverview',
      )} ${department}`}</h2>
    );
  } else if (location.pathname.slice(1) === 'message-board') {
    return (
      <h4 data-testid="messageboard-header" className="text-secondary">
        {t('headerMessageBoard')}
      </h4>
    );
  } else if (
    location.pathname.split('/')[1] === 'message-board' &&
    location.pathname.split('/')[2] === 'comments'
  ) {
    return (
      <h4 data-testid="messageboard-comments-header" className="text-secondary">
        {t('headerMessageComments')}
      </h4>
    );
  } else if (location.pathname.slice(1) === 'leaderboard') {
    return (
      <h4 data-testid="leaderboard-header" className="text-secondary">
        {t('headerLeaderBoard')}
      </h4>
    );
  } else if (location.pathname.slice(1) === 'case-study') {
    return (
      <h4 data-testid="case-study-header" className="text-secondary">
        {t('headerCaseStudy')}
      </h4>
    );
  } else if (
    location.pathname.split('/')[1] === 'case-study' &&
    location.pathname.split('/')[2] === 'form'
  ) {
    return <h4 className="text-secondary">{t('headerCaseStudyForm')}</h4>;
  } else if (location.pathname.slice(1) === 'employee-of-the-month') {
    return (
      <h4 data-testid="eotm-header" className="text-secondary">
        {t('headerEmployeeOfTheMonth')}
      </h4>
    );
  } else if (
    location.pathname.split('/')[1] === 'employee-of-the-month' &&
    location.pathname.split('/')[2] === 'form'
  ) {
    return (
      <h4 data-testid="eotm-form-header" className="text-secondary">
        {t('headerEmployeeOfTheMonthForm')}
      </h4>
    );
  } else if (location.pathname.slice(1) === 'biomechanic') {
    return (
      <h4 data-testid="biomech-header" className="text-secondary">
        {t('headerBiomechanicalSupport')}
      </h4>
    );
  } else if (
    location.pathname.split('/')[1] === 'biomechanic' &&
    location.pathname.split('/')[2] === 'report-broken-kit'
  ) {
    return (
      <h4 data-testid="biomech-form-header" className="text-secondary">
        {t('headerBiomechanicalSupportForm')}
      </h4>
    );
  } else if (location.pathname.slice(1) === 'brokenkit') {
    return (
      <h4 data-testid="case-study-view-header" className="text-secondary">
        {t('headerBrokenKitReport')}
      </h4>
    );
  } else if (location.pathname.split('/')[1] === 'caseStudyView') {
    return <h4 className="text-secondary">{t('headerCaseStudyForm')}</h4>;
  } else if (location.pathname.slice(1) === 'Department1NICU') {
    return <h4 className="text-secondary">{t('headerDepartmentNICU')}</h4>;
  } else if (location.pathname.slice(1) === 'Department2Maternity') {
    return <h4 className="text-secondary">{t('headerDepartmentMaternity')}</h4>;
  } else if (location.pathname.slice(1) === 'Department3Rehab') {
    return <h4 className="text-secondary">{t('headerDepartmentRehab')}</h4>;
  } else if (location.pathname.slice(1) === 'Department4ComHealth') {
    return <h4 className="text-secondary">{t('headerDepartmentCom')}</h4>;
  } else if (location.pathname.slice(1) === 'Report') {
    return <h4 className="text-secondary">{t('headerReport')}</h4>;
  } else if (location.pathname.slice(1) === 'admin') {
    return (
      <h4 data-testid="admin-header" className="text-secondary">
        {t('headerAdmin')}
      </h4>
    );
  } else if (location.pathname.slice(1) === 'general_reports') {
    // Need translation
    return <h4 className="text-secondary">{t('headerGeneralReports')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'admin' &&
    location.pathname.split('/')[2] === 'add-user'
  ) {
    return <h4 className="text-secondary">{t('headerAddUser')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'admin' &&
    location.pathname.split('/')[2] === 'edit-user'
  ) {
    return <h4 className="text-secondary">{t('headerEditUser')}</h4>;
  } else {
    return <h4>{''}</h4>;
  }
};

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const history: History = useHistory<History>();
  const [userInfo, setUserInfo] = useState(null);
  const { t } = useTranslation();

  const logout = () => {
    logOutUser(dispatch, history);
    history.push('/login');
  };

  useEffect(() => {
    const getUserInfo = async (controller: AbortController) => {
      const user: UserDetails = await Api.Get(
        ENDPOINT_ADMIN_ME,
        ResponseMessage.getMsgFetchUserFailed(),
        history,
        controller.signal,
      );

      setUserInfo(user);
    };

    const controller = new AbortController();

    getUserInfo(controller);

    return () => {
      controller.abort();
    };
  }, [history]);

  return (
    <>
      {userInfo && (
        <div className="d-flex align-items-center pt-3 pb-2 mb-3 mx-1 border-bottom row">
          <div className="col">
            <HeaderView user={userInfo} title={title} />
          </div>

          {/* User drop down */}
          <div className="col-auto">
            <div className="dropdown">
              <button
                data-testid="user-dropdown"
                className="btn dropdown-toggle"
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="d-none d-sm-inline fw-bold">{userInfo.name}</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end rounded shadow">
                <li className="d-block d-sm-none">
                  <button className="dropdown-item disabled fw-bold text-muted mb-2">
                    {userInfo.name}
                  </button>
                </li>
                <li>
                  <button className="dropdown-item disabled text-muted mb-2">
                    <i className="bi bi-person-badge-fill"></i>
                    {t(userInfo.role)}
                  </button>
                </li>
                <li className={`${userInfo.department.name ? 'd-block' : 'd-none'}`}>
                  <button className="dropdown-item disabled text-muted">
                    <i className="bi bi-people-fill"></i>
                    {userInfo.department.name}
                  </button>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    data-testid="signout-button"
                    className="dropdown-item"
                    type="button"
                    onClick={logout}
                  >
                    <i className="fa fa-sign-out" aria-hidden="true"></i>
                    {t('headerSignOut')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
