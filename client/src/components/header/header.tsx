import { useAuthDispatch } from '../../contexts';
import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { UserJson } from 'constants/interfaces';
import { EMPTY_USER_JSON } from 'constants/default_values';
import { logOutUser } from '../../actions/authActions';
import Api from 'actions/Api';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { ENDPOINT_ADMIN_ME } from 'constants/endpoints';
import { ResponseMessage } from 'utils/response_message';

interface HeaderProps {}
interface HeaderViewProps {
  user: UserJson;
}

const HeaderView = (props: HeaderViewProps) => {
  const { t } = useTranslation();
  const location = useLocation();
  const user = props.user;
  const department =
    user.department.name === undefined && user.role === undefined
      ? ''
      : `- ${user.department.name !== undefined ? user.department.name : user.role}`;
  if (location.pathname.slice(1) === 'home') {
    return <h2 className="text-secondary">{`${t('headerOverview')} ${department}`}</h2>;
  } else if (location.pathname.slice(1) === 'message-board') {
    return <h4 className="text-secondary">{t('headerMessageBoard')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'message-board' &&
    location.pathname.split('/')[2] === 'comments'
  ) {
    return <h4 className="text-secondary">{t('headerMessageComments')}</h4>;
  } else if (location.pathname.slice(1) === 'leaderboard') {
    return <h4 className="text-secondary">{t('headerLeaderBoard')}</h4>;
  } else if (location.pathname.slice(1) === 'case-study') {
    return <h4 className="text-secondary">{t('headerCaseStudy')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'case-study' &&
    location.pathname.split('/')[2] === 'form'
  ) {
    return <h4 className="text-secondary">{t('headerCaseStudyForm')}</h4>;
  } else if (location.pathname.slice(1) === 'employee-of-the-month') {
    return <h4 className="text-secondary">{t('headerEmployeeOfTheMonth')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'employee-of-the-month' &&
    location.pathname.split('/')[2] === 'form'
  ) {
    return <h4 className="text-secondary">{t('headerEmployeeOfTheMonthForm')}</h4>;
  } else if (location.pathname.slice(1) === 'biomechanic') {
    return <h4 className="text-secondary">{t('headerBiomechanicalSupport')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'biomechanic' &&
    location.pathname.split('/')[2] === 'report-broken-kit'
  ) {
    return <h4 className="text-secondary">{t('headerBiomechanicalSupportForm')}</h4>;
  } else if (location.pathname.slice(1) === 'brokenkit') {
    return <h4 className="text-secondary">{t('headerBrokenKitReport')}</h4>;
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
  } else if (location.pathname.slice(1) === 'admin') {
    return <h4 className="text-secondary">{t('headerAdmin')}</h4>;
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

const Header = (props: HeaderProps) => {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const onLogOut = () => {
    logOutUser(dispatch, history);
    history.push('/login');
  };
  const history: History = useHistory<History>();
  const [userInfo, setUserInfo] = useState(EMPTY_USER_JSON);

  useEffect(() => {
    let isMounted: boolean = true;

    const getUserInfo = async () => {
      const user: UserJson = await Api.Get(
        ENDPOINT_ADMIN_ME,
        ResponseMessage.getMsgFetchUserFailed(),
        history,
      );
      if (isMounted) setUserInfo(user);
    };
    getUserInfo();

    return function cleanUp() {
      isMounted = false;
    };
  }, [history]);

  const { t, i18n } = useTranslation();
  return (
    <div className={'header'}>
      <div className="d-flex align-items-center pt-3 pb-2 mb-3 mx-1 border-bottom row">
        <div className="col">
          <HeaderView user={userInfo} />
        </div>

        {/* User drop down */}
        <div className="col-auto">
          <div className="dropdown">
            <button
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
                  {i18n.t(userInfo.role)}
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
                <button className="dropdown-item" type="button" onClick={onLogOut}>
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  {t('headerSignOut')}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
