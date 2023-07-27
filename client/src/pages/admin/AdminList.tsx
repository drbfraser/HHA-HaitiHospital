import { ENDPOINT_ADMIN_DELETE_BY_ID, ENDPOINT_ADMIN_GET } from 'constants/endpoints';
import { Link, useHistory } from 'react-router-dom';
import { language, timezone } from 'constants/timezones';
import { useCallback, useEffect, useState } from 'react';

import Api from 'actions/Api';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const AdminList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [users, setUsers] = useState([]);
  
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const deleteUserActions = () => {
    getUsers();
    toast.success(ResponseMessage.getMsgDeleteUserOk());
  };

  const getUsers = useCallback(async () => {
    const controller = new AbortController();
    setUsers(
      await Api.Get(
        ENDPOINT_ADMIN_GET,
        ResponseMessage.getMsgFetchUsersFailed(),
        history,
        controller.signal,
      ),
    );
    return () => {
      controller.abort();
    };
  }, [history]);

  const deleteUser = async (id: string) => {
    await Api.Delete(
      ENDPOINT_ADMIN_DELETE_BY_ID(id),
      {},
      deleteUserActions,
      ResponseMessage.getMsgDeleteUserFailed(),
      history,
    );
  };

  const onDeleteUser = (event: any, id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(id);
    setShowDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(null);
    setShowDeleteModal(false);
  };

  const onModalDelete = () => {
    deleteUser(currentIndex);
    setShowDeleteModal(false);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  return (
    <Layout title={t('headerAdmin')}>
      <DeleteModal
        dataTestId="confirm-delete-user-button"
        show={showDeleteModal}
        itemName={t('item.user')}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
      ></DeleteModal>
      <div className="d-flex justify-content-start">
        <Link to={Paths.getAdminAddUser()}>
          <button data-testid="add-user-button" type="button" className="btn btn-outline-dark">
            {t('button.add_user')}
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
                      data-testid="edit-user-button"
                      type="button"
                      className="btn btn-link text-decoration-none"
                      onClick={() => history.push(`${Paths.getAdminEditUser(item.id)}`)}
                    >
                      {t('button.edit')}
                    </button>

                    <button
                      data-testid="view-user-button"
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
    </Layout>
  );
};

export default AdminList;
