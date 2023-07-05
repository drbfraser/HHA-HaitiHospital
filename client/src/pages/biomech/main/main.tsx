import './main.css';

import { Badge, Button } from 'react-bootstrap';
import { ENDPOINT_BIOMECH_DELETE_BY_ID, ENDPOINT_BIOMECH_GET } from 'constants/endpoints';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { setPriority, setStatusBadgeColor } from 'pages/biomech/utils';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { Role } from 'constants/interfaces';
import { renderBasedOnRole } from 'actions/roleActions';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps {}

const enumSort = (key, e) => {
  type enumKey = keyof typeof e;

  return (rowA, rowB) => {
    const reportA = rowA.getValue(key) as enumKey;
    const reportB = rowB.getValue(key) as enumKey;

    return e[reportA] - e[reportB];
  };
};

enum Priority {
  'non-urgent',
  'important',
  'urgent',
}

enum Status {
  'in-progress',
  'fixed',
  'backlog',
}

const prioritySort = enumSort('equipmentPriority', Priority);

const statusSort = enumSort('equipmentStatus', Status);

export const BiomechanicalPage = (_: Props) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [BioReport, setBioReport] = useState([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();

  // Github co-pilot assited in filling this array
  const columns = useMemo(
    (): FilterableColumnDef[] => [
      {
        id: 'equipmentPriority',
        header: t('biomech.main_page.priority_col'),
        cell: (row) => (
          <Badge bg={setPriority(row.getValue())}>{t(`biomech.priority.${row.getValue()}`)}</Badge>
        ),
        accessorKey: 'equipmentPriority',
        sortingFn: prioritySort,
        sortDescFirst: true,
      },
      {
        id: 'equipmentStatus',
        header: t('biomech.main_page.status_col'),
        cell: (row) => (
          <Badge bg={setStatusBadgeColor(row.getValue())}>
            {t(`biomech.status.${row.getValue()}`)}
          </Badge>
        ),
        accessorKey: 'equipmentStatus',
        sortingFn: statusSort,
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
        header: '',
        enableGlobalFilter: false,
        enableColumnFilter: false,
        cell: (row) => (
          <>
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
              <Button
                data-testid="delete-biomech-button"
                onClick={(event) => onDeleteBioMech(event, row.getValue())}
                variant="link"
                title={t('button.delete')}
                className="text-decoration-none link-secondary"
              >
                <i className="bi bi-trash"></i>
              </Button>
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
    toast.success(ResponseMessage.getMsgDeleteReportOk());
    setBioReport(BioReport.filter((item) => item.id !== currentIndex));
    setCurrentIndex(null);
  };

  const deleteBioMech = async (id: string) => {
    await Api.Delete(
      ENDPOINT_BIOMECH_DELETE_BY_ID(id),
      {},
      deleteBioMechCallback,
      ResponseMessage.getMsgDeleteReportFailed(),
      history,
    );
  };

  const onDeleteBioMech = (event: any, id: string) => {
    event.stopPropagation();
    setCurrentIndex(id);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(null);
    setDeleteModal(false);
  };

  const onModalDelete = async (id: string) => {
    await deleteBioMech(id);
    setDeleteModal(false);
  };

  useEffect(() => {
    const getBioReport = async (controller?: AbortController) => {
      const data = await Api.Get(
        ENDPOINT_BIOMECH_GET,
        ResponseMessage.getMsgFetchReportsFailed(),
        history,
        controller && controller.signal,
      );

      setBioReport(data);
    };

    const controller = new AbortController();
    getBioReport(controller);

    return () => controller.abort();
  }, [history]);

  return (
    <div className="biomechanical_page">
      <Layout>
        <ModalDelete
          dataTestId="confirm-delete-biomech-button"
          currentItem={currentIndex}
          show={deleteModal}
          item={t('item.report')}
          onModalClose={onModalClose}
          onModalDelete={onModalDelete}
          history={history}
          location={undefined}
          match={undefined}
        ></ModalDelete>

        <section>
          <div className="row my-2 justify-items-center">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <Link to={`${Paths.getBioMechReport()}`}>
                <button
                  data-testid="add-biomech-button"
                  type="button"
                  className="btn btn-outline-dark"
                >
                  {t(`button.report`)}
                </button>
              </Link>
            </div>
            <FilterableTable
              data={BioReport}
              columns={columns}
              rowClickHandler={(item) => history.push(`${Paths.getBioMechViewId(item.id)}`)}
              enableFilters
              enableGlobalFilter
              enableSorting
            />
          </div>
        </section>
      </Layout>
    </div>
  );
};
