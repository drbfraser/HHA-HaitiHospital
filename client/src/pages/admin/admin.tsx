import { useCallback, useEffect, useState } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import { Link, useHistory } from 'react-router-dom';
import Api from 'actions/Api';
import { ENDPOINT_ADMIN_GET, ENDPOINT_ADMIN_DELETE_BY_ID } from 'constants/endpoints';
import './admin.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { History } from 'history';
import { timezone, language } from 'constants/timezones';

interface AdminProps {}

const Admin = (props: AdminProps) => {
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [users, setUsers] = useState([]);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const deleteUserActions = () => {
    getUsers();
    toast.success(t("admin.toast.user_delete_ok"));
  };

  const getUsers = useCallback(async () => {
    setUsers(await Api.Get(ENDPOINT_ADMIN_GET, t('admin.toast.fetch_users_failed'), history));
  }, [history]);

  const deleteUser = async (id: string) => {
    await Api.Delete(
      ENDPOINT_ADMIN_DELETE_BY_ID(id),
      {},
      deleteUserActions,
      t('admin.toast.user_delete_failed'),
      history,
    );
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
          item={t('modal.item.user_account')}
          onModalClose={onModalClose}
          onModalDelete={onModalDelete}
          history={history}
          location={undefined}
          match={undefined}
        ></ModalDelete>
        <div className="d-flex justify-content-start">
          <Link to="/admin/add-user">
            <button type="button" className="btn btn-outline-dark">
              {t('admin.main_page.add_user_btn')}
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t('admin.main_page.name_col')}</th>
                <th scope="col">{t('admin.main_page.role_col')}</th>
                <th scope="col">{t('admin.main_page.department_col')}</th>
                <th scope="col">{t('admin.main_page.created_col')}</th>
                <th scope="col" className="text-center">
                  {t('admin.main_page.options_col')}
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((item, index) => (
                <tr key={index}>
                  <th scope="row">{index + 1}</th>
                  <td>{item.name}</td>
                  <td>{item.role}</td>
                  <td>{item.department.name}</td>
                  <td>
                    {new Date(item.createdAt).toLocaleString(language, {
                      timeZone: timezone,
                    })}
                  </td>
                  <td>
                    <div className="text-center">
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/admin/edit-user/${item.id}`)}
                      >
                        {t('button.edit')}
                      </button>

                      <button
                        type="button"
                        className="btn btn-link text-decoration-none"
                        onClick={(event) => {
                          onDeleteUser(event, item.id);
                        }}
                      >
                        {t('button.delete')}
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
