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
import { useTranslation } from 'react-i18next';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Button } from 'react-bootstrap';
import { useAuthState } from 'contexts';

const AdminList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [users, setUsers] = useState([]);
  const user = useAuthState();

  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const deleteUserActions = () => {
    getUsers();
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
      history,
      ResponseMessage.getMsgDeleteUserFailed(),
      null,
      ResponseMessage.getMsgDeleteUserOk(),
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

  const gridData = users.map((item) => ({
    item,
    id: item.id,
    createdAt: new Date(item.createdAt).toLocaleDateString(language, {
      timeZone: timezone,
    }),
  }));

  const columns: FilterableColumnDef[] = [
    {
      header: t('admin.main_page.name_col'),
      id: 'item.name',
      accessorKey: 'item.name',
    },
    {
      header: t('admin.main_page.username_col'),
      id: 'item.username',
      accessorKey: 'item.username',
    },
    {
      header: t('admin.main_page.role_col'),
      id: 'item.role',
      accessorKey: 'item.role',
    },
    {
      header: t('admin.main_page.department_col'),
      id: 'item.department.name',
      accessorKey: 'item.department.name',
    },
    {
      header: t('admin.main_page.created_col'),
      id: 'createdAt',
      accessorKey: 'createdAt',
    },
    {
      id: 'Options',
      header: t('reportsOptions'),
      enableGlobalFilter: false,
      enableColumnFilter: false,
      cell: (row) => (
        <>
          <div>
            <Button
              disabled={user.userDetails.id === row.getValue().id}
              onClick={(event) => onDeleteUser(event, row.getValue().id)}
              variant="link"
              title={t('button.delete')}
              className="text-decoration-none link-secondary"
            >
              <i className="bi bi-trash"></i>
            </Button>
            <Link
              title={t('button.edit')}
              className="text-decoration-none link-secondary"
              to={Paths.getAdminEditUser(row.getValue().id)}
              onClick={(event) => event.stopPropagation()}
            >
              <i className="bi bi-pencil"></i>
            </Link>
          </div>
        </>
      ),
      accessorKey: 'item',
      enableSorting: false,
    },
  ];

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
        {gridData.length > 0 ? (
          <FilterableTable
            columns={columns}
            data={gridData}
            enableFilters
            enableGlobalFilter
            enableSorting
          />
        ) : (
          <p>{t('admin.main_page.noUsers')}</p>
        )}
      </div>
    </Layout>
  );
};

export default AdminList;
