import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { PriorityBadge, StatusBadge } from 'pages/biomech/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Badge, Button } from 'react-bootstrap';
import { Link, useHistory } from 'react-router-dom';
import { BiomechJson as Biomech, BiomechPriority, BiomechStatus, Role } from '@hha/common';
import { Row } from '@tanstack/react-table';
import { renderBasedOnRole } from 'actions/roleActions';
import { deleteBiomech, getAllBiomechs } from 'api/biomech';
import { FilterType } from 'components/filter/Filter';
import Layout from 'components/layout';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { toI18nDateString } from 'constants/date';
import { Paths } from 'constants/paths';
import { useAuthState } from 'contexts';
import { History } from 'history';
import { useTranslation } from 'react-i18next';

const enumSort = (key: any, e: any) => {
  type enumKey = keyof typeof e;

  return (rowA: Row<any>, rowB: Row<any>) => {
    const reportA = rowA.getValue(key) as enumKey;
    const reportB = rowB.getValue(key) as enumKey;

    return e[reportA] - e[reportB];
  };
};

const Priority = {
  'non-urgent': 0,
  important: 1,
  urgent: 2,
};

const Status = {
  'in-progress': 0,
  fixed: 1,
  backlog: 2,
};

const prioritySort = enumSort('equipmentPriority', Priority);

const statusSort = enumSort('equipmentStatus', Status);

export const BiomechanicalList = () => {
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>();
  const [biomechData, setBiomechData] = useState<Biomech[]>([]);

  // Github co-pilot assited in filling this array
  const columns = useMemo(
    (): FilterableColumnDef[] => [
      {
        id: 'equipmentPriority',
        header: t('biomech.main_page.priority_col'),
        cell: (row) => (
          <Badge bg={PriorityBadge[row.getValue() as BiomechPriority]}>
            {t(`biomech.priority.${row.getValue()}`)}
          </Badge>
        ),
        accessorKey: 'equipmentPriority',
        sortingFn: prioritySort,
        sortDescFirst: true,
        meta: {
          dataType: FilterType.STRING,
          enumOptions: [
            { value: 'non-urgent', label: t('biomech.priority.non-urgent') },
            { value: 'important', label: t('biomech.priority.important') },
            { value: 'urgent', label: t('biomech.priority.urgent') },
          ],
        },
      },
      {
        id: 'equipmentStatus',
        header: t('biomech.main_page.status_col'),
        cell: (row) => (
          <Badge bg={StatusBadge[row.getValue() as BiomechStatus]}>
            {t(`biomech.status.${row.getValue()}`)}
          </Badge>
        ),
        accessorKey: 'equipmentStatus',
        sortingFn: statusSort,
        meta: {
          dataType: FilterType.STRING,
          enumOptions: [
            { value: 'in-progress', label: t('biomech.status.in-progress') },
            { value: 'fixed', label: t('biomech.status.fixed') },
            { value: 'backlog', label: t('biomech.status.backlog') },
          ],
        },
      },
      {
        id: 'equipmentName',
        header: t('biomech.main_page.equipment_col'),
        cell: (row) => row.getValue(),
        accessorKey: 'equipmentName',
      },
      {
        id: 'author',
        header: t('biomech.main_page.author_col'),
        accessorFn: (row) => row.user?.name ?? t('status.not_available'),
      },
      {
        id: 'createdAt',
        header: t('biomech.main_page.created_col'),
        enableGlobalFilter: false,
        accessorKey: 'createdAt',
        cell: (row) => (
          <span>{toI18nDateString(row.row.original.createdAt, i18n.resolvedLanguage)}</span>
        ),
      },
      {
        id: 'Options',
        header: t('biomech.main_page.options_col'),
        enableGlobalFilter: false,
        enableColumnFilter: false,
        cell: (row) => (
          <>
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
              <>
                <Button
                  data-testid="delete-biomech-button"
                  onClick={(event) => onDeleteBioMech(event, row.getValue())}
                  variant="link"
                  title={t('button.delete')}
                  className="text-decoration-none link-secondary"
                >
                  <i className="bi bi-trash"></i>
                </Button>
                <Link
                  data-testid="edit-biomech-button"
                  title={t('button.edit')}
                  className="text-decoration-none link-secondary"
                  to={Paths.getBioMechEditId(row.getValue())}
                  onClick={(event) => event.stopPropagation()}
                >
                  <i className="bi bi-pencil"></i>
                </Link>
              </>
            )}
          </>
        ),
        accessorKey: 'id',
        enableSorting: false,
      },
    ],
    [authState.userDetails.role, i18n.resolvedLanguage, t],
  );

  const deleteBioMechCallback = () => {
    setBiomechData(biomechData.filter((item) => item.id !== currentIndex));
    setCurrentIndex('');
  };

  const deleteBioMechById = async (id: string) => deleteBiomech(id, deleteBioMechCallback, history);

  const onDeleteBioMech = (event: any, id: string) => {
    event.stopPropagation();
    setCurrentIndex(id);
    setIsDeleteModalOpen(true);
  };

  const onModalClose = () => {
    setCurrentIndex(undefined);
    setIsDeleteModalOpen(false);
  };

  const onModalDelete = async () => {
    if (currentIndex) {
      await deleteBioMechById(currentIndex);
    }
    setIsDeleteModalOpen(false);
  };

  const getBiomechs = useCallback(async () => {
    const biomechs = await getAllBiomechs(history);
    setBiomechData(biomechs);
  }, [history]);

  useEffect(() => {
    getBiomechs();
  }, [getBiomechs]);

  return (
    <Layout title={t('headerBiomechanicalSupport')}>
      <DeleteModal
        dataTestId="confirm-delete-biomech-button"
        show={isDeleteModalOpen}
        itemName={t('item.report')}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
      ></DeleteModal>

      <div className="row justify-items-center">
        <div className="col-sm-6">
          <Link to={`${Paths.getBioMechReport()}`}>
            <button data-testid="add-biomech-button" type="button" className="btn btn-outline-dark">
              {t(`button.report`)}
            </button>
          </Link>
        </div>
        <FilterableTable
          data={biomechData}
          columns={columns}
          rowClickHandler={(item) => history.push(`${Paths.getBioMechViewId(item.id)}`)}
          rowTestId="view-biomech-report"
          enableFilters
          enableGlobalFilter
          enableSorting
        />
      </div>
    </Layout>
  );
};
