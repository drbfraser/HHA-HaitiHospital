import { Badge, Button } from 'react-bootstrap';
import { ENDPOINT_BIOMECH_DELETE_BY_ID, ENDPOINT_BIOMECH_GET } from 'constants/endpoints';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { PriorityBadge, StatusBadge } from 'pages/biomech/utils';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { FilterType } from 'components/filter/Filter';
import { History } from 'history';
import Layout from 'components/layout';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { Role } from 'constants/interfaces';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { Row } from '@tanstack/react-table';
import { Variant } from 'react-bootstrap/esm/types';
import { BiomechPriority, BiomechStatus } from './typing';
import { BiomechGet } from 'constants/jsons';

const enumSort = (key: string, e: any) => {
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
  const { t } = useTranslation();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>();
  const [biomechData, setBiomechData] = useState<BiomechGet[]>([]);

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
          dataType: FilterType.ENUM,
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
          dataType: FilterType.ENUM,
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
    [authState.userDetails.role, t],
  );

  const deleteBioMechCallback = () => {
    setBiomechData(biomechData.filter((item) => item.id !== currentIndex));
    setCurrentIndex('');
  };

  const deleteBioMech = async (id: string) => {
    await Api.Delete(
      ENDPOINT_BIOMECH_DELETE_BY_ID(id),
      {},
      deleteBioMechCallback,
      history,
      ResponseMessage.getMsgDeleteReportFailed(),
      undefined,
      ResponseMessage.getMsgDeleteReportOk(),
    );
  };

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
      await deleteBioMech(currentIndex);
    }
    setIsDeleteModalOpen(false);
  };

  useEffect(() => {
    const getBioReport = async (controller?: AbortController) => {
      const data: BiomechGet[] = await Api.Get(
        ENDPOINT_BIOMECH_GET,
        ResponseMessage.getMsgFetchReportsFailed(),
        history,
        controller && controller.signal,
      );

      setBiomechData(data);
    };

    const controller = new AbortController();
    getBioReport(controller);

    return () => controller.abort();
  }, [history]);

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
