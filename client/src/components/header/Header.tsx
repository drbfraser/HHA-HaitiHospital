import { UserJson } from '@hha/common';
import { History } from 'history';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import { logOutUser } from '../../actions/authActions';
import { useAuthDispatch, useAuthState } from '../../contexts';

interface HeaderProps {
  title?: string;
}

const Header = ({ title }: HeaderProps) => {
  const dispatch = useAuthDispatch(); // read dispatch method from context
  const history: History = useHistory<History>();
  const { t } = useTranslation();
  const user = useAuthState();
  const userDetails: UserJson = user?.userDetails;

  const logout = () => {
    logOutUser(dispatch, history);
    history.push('/login');
  };

  return (
    <>
      {userDetails && (
        <div className="d-flex align-items-center pt-3 pb-2 mb-3 mx-1 border-bottom row">
          <div className="col">
            <h2 data-testid="header" className="text-secondary">
              {title}
            </h2>
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
                <span className="d-none d-sm-inline fw-bold">{userDetails.name}</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end rounded shadow"
                data-testid="user-dropdown-list"
              >
                <li className="d-block d-sm-none">
                  <button className="dropdown-item disabled fw-bold text-muted mb-2">
                    {userDetails.name}
                  </button>
                </li>
                <li>
                  <button
                    data-testid="user-role"
                    className="dropdown-item disabled text-muted mb-2"
                  >
                    <i className="bi bi-person-badge-fill"></i>
                    {t(userDetails.role)}
                  </button>
                </li>
                <li className={`${userDetails.department.name ? 'd-block' : 'd-none'}`}>
                  <button
                    data-testid="user-department"
                    className="dropdown-item disabled text-muted"
                  >
                    <i className="bi bi-people-fill"></i>
                    {userDetails.department.name}
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
