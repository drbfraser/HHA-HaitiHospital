import { useEffect, useState } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './admin.css';
import DbErrorHandler from 'actions/http_error_handler';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface AdminProps extends ElementStyleProps {}

const Admin = (props: AdminProps) => {
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const { t } = useTranslation();

  const usersUrl = '/api/users';
  const getUsers = async () => {
    try {
      const res = await axios.get(usersUrl);
      setUsers(res.data);
    } catch (err) {
      DbErrorHandler(err, history);
    }
  };

  const deleteUser = async (id) => {
    try {
      if (!window.confirm(i18n.t('adminAreYouSureToDeleteTheUser'))) {
        throw new Error('Deletion cancelled');
      }
      const res = await axios.delete(usersUrl + '/' + id);
      getUsers();
      alert(i18n.t('adminAlertUserDeleted'));
    } catch (err) {
      DbErrorHandler(err, history);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className={'admin ' + (props.classes || '')}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="d-flex justify-content-start">
          <Link to="/admin/add-user">
            <button type="button" className="btn btn-outline-dark">
              {t('adminAddUser')}
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t('adminUsername')}</th>
                <th scope="col">{t('adminName')}</th>
                <th scope="col">{t('adminRole')}</th>
                <th scope="col">{t('adminDepartment')}</th>
                <th scope="col">{t('adminCreated')}</th>
                <th scope="col" className="text-center">
                  {t('adminOptions')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={item.id}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.department ? item.department : 'N/A'}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleString('en-US', {
                      timeZone: 'America/Los_Angeles',
                    })}
                  </td>
                  <td>
                    <div className="text-center">
                      <a
                        href="javascript:void(0)"
                        className="link-primary text-decoration-none"
                        onClick={() => history.push(`/admin/edit-user/${item.id}`)}
                      >
                        {t('adminEdit')}{' '}
                      </a>
                      <a
                        href="javascript:void(0)"
                        className="link-primary text-decoration-none"
                        onClick={() => deleteUser(item.id)}
                      >
                        {t('adminDelete')}
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

export default Admin;
