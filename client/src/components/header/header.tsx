import { useAuthDispatch } from '../../Context';
import { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { User, Role, DepartmentName } from 'constants/interfaces';
import { logOutUser } from '../../actions/authActions';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import { userInfo } from 'os';
interface HeaderProps {}
interface HeaderViewProps {
  user: User;
}

function HeaderView(props: HeaderViewProps) {
  const { t } = useTranslation();
  const location = useLocation();
  const user = props.user;
  const department =
    user.department == undefined && user.role == undefined
      ? ''
      : `- ${user.department != undefined ? user.department : user.role}`;
  if (location.pathname.slice(1) === 'home') {
    return <h2 className="text-secondary">{`${t('headerOverview')} ${department}`}</h2>;
  } else if (location.pathname.slice(1) === 'message-board') {
    return <h4 className="text-secondary">{t('headerMessageBoard')}</h4>;
  } else if (location.pathname.slice(1) === 'leaderboard') {
    return <h4 className="text-secondary">{t('headerLeaderBoard')}</h4>;
  } else if (location.pathname.slice(1) === 'case-study') {
    return <h4 className="text-secondary">{t('headerCaseStudy')}</h4>;
  } else if (
    location.pathname.split('/')[1] === 'case-study' &&
    location.pathname.split('/')[2] === 'form'
  ) {
    return <h4 className="text-secondary">{t('headerCaseStudyForm')}</h4>;
  } else if (location.pathname.slice(1) === 'biomechanic') {
    return <h4 className="text-secondary">{t('headerBiomechanicalSupport')}</h4>;
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
}

const Header = (props: HeaderProps) => {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const onLogOut = (event) => {
    logOutUser(dispatch);
    history.push('/login');
  };
  const history = useHistory();
  const [userInfo, setUserInfo] = useState({} as User);
  const userUrl = '/api/users/me';

  const getUserInfo = async () => {
    try {
      const res = await axios.get(userUrl);
      setUserInfo(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

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
                  <i className="bi bi-person-fill"></i>
                  {' @' + userInfo.username}
                </button>
              </li>
              <li>
                <button className="dropdown-item disabled text-muted mb-2">
                  <i className="bi bi-person-badge-fill"></i>
                  {' ' + i18n.t(userInfo.role)}
                </button>
              </li>
              <li className={`${userInfo.department ? 'd-block' : 'd-none'}`}>
                <button className="dropdown-item disabled text-muted">
                  <i className="bi bi-people-fill"></i>
                  {' ' + userInfo.department}
                </button>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button className="dropdown-item" type="button" onClick={onLogOut}>
                  <i className="fa fa-sign-out" aria-hidden="true"></i>
                  {' ' + t('headerSignOut')}
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
