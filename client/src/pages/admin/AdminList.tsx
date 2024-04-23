import { UserClientModel as User } from '@hha/common';
import { deleteUser, getAllUsers } from 'api/user';
import Layout from 'components/layout';
import DeleteModal from 'components/popup_modal/DeleteModal';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { toI18nDateString } from 'constants/date';
import { Paths } from 'constants/paths';
import { useAuthState } from 'contexts';
import { History } from 'history';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { toSnakeCase } from 'utils/string';

const AdminList = () => {
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const user = useAuthState();

  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const deleteUserActions = () => {
    getUsers();
  };

  const getUsers = useCallback(async () => {
    const users = await getAllUsers(history);
    setUsers(users);
  }, [history]);

  const deleteUserById = async (id: string) => deleteUser(id, deleteUserActions, history);

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
    if (currentIndex) {
      deleteUserById(currentIndex);
    }
    setShowDeleteModal(false);
  };

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const gridData = users.map((item) => ({
    item,
    id: item.id,
    createdAt: item.createdAt,
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
      accessorFn: (row) => t(`role.${toSnakeCase(row.item.role)}`),
    },
    {
      header: t('admin.main_page.department_col'),
      id: 'item.department.name',
      accessorFn: (row) => t(row.item.department.name),
    },
    {
      id: 'createdAt',
      header: t('biomech.main_page.created_col'),
      enableGlobalFilter: false,
      accessorKey: 'createdAt',
      cell: (row) => (
        <span>{toI18nDateString(row.row.original.createdAt, i18n.resolvedLanguage)}</span>
      ),
      filterFn: () => true, // had to include to remove filterValue.toLowerCase is not a func error
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
              data-testid="delete-user-button"
              disabled={user.userDetails.id === row.getValue().id}
              onClick={(event) => onDeleteUser(event, row.getValue().id)}
              variant="link"
              title={t('button.delete')}
              className="text-decoration-none link-secondary"
            >
              <i className="bi bi-trash"></i>
            </Button>
            <Link
              data-testid="edit-user-button"
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
