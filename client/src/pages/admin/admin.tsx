import { useCallback, useEffect, useState } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import { Link, useHistory } from 'react-router-dom';
import axios from 'axios';
import './admin.css';
import DbErrorHandler from 'actions/http_error_handler';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

interface AdminProps {}

const Admin = (props: AdminProps) => {
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [users, setUsers] = useState([]);
  const history = useHistory();
  const { t } = useTranslation();
  const usersUrl = '/api/users';

  const getUsers = useCallback(async () => {
    try {
      const res = await axios.get(usersUrl);
      setUsers(res.data);
    } catch (err) {
      DbErrorHandler(err, history, 'Unable to get user');
    }
  }, [history]);

  const deleteUser = async (id: string) => {
    try {
      await axios.delete(`${usersUrl}/${id}`);
      getUsers();
      toast.success(i18n.t('adminAlertUserDeleted'));
    } catch (err) {
      DbErrorHandler(err, history, 'Unable to delete user');
    }
  };

  const onDeleteUser = (event: any, id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(id);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = (id: string) => {
    deleteUser(id);
    setDeleteModal(false);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <div className={'admin'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <ModalDelete
          currentItem={currentIndex}
          show={deleteModal}
          item={'user account'}
          onModalClose={onModalClose}
          onModalDelete={onModalDelete}
        ></ModalDelete>
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
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.username}</td>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.department ? item.department : 'N/A'}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleString('en-US', {
                      timeZone: 'America/Cancun',
                    })}
                  </td>
                  <td>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/admin/edit-user/${item.id}`)}
                      >
                        {t('adminEdit')}
                      </button>

                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={(event) => {
                          onDeleteUser(event, item.id);
                        }}
                      >
                        {t('adminDelete')}
                      </button>
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
