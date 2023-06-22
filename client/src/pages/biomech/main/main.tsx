import './main.css';

import { Badge, Form, Table } from 'react-bootstrap';
import {
  DisplayColumnDef,
  createColumn,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ENDPOINT_BIOMECH_DELETE_BY_ID, ENDPOINT_BIOMECH_GET } from 'constants/endpoints';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { language, timezone } from 'constants/timezones';
import { setPriority, setStatusBadgeColor } from 'pages/biomech/utils';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import FilterableTable from 'components/table/FilterableTable';
import { History } from 'history';
import Layout from 'components/layout';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import Pagination from 'components/pagination/Pagination';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { Role } from 'constants/interfaces';
import { renderBasedOnRole } from 'actions/roleActions';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

interface Props extends RouteComponentProps {}

const columnHelper = createColumnHelper<any>();

export const BiomechanicalPage = (_: Props) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [BioReport, setBioReport] = useState([]);
  const [globalFilter, setGlobalFilter] = useState<string>('');
  const authState = useAuthState();
  const history: History = useHistory<History>();

  const columns = useMemo(
    () => [
      columnHelper.display({
        header: '#',
        cell: (row) => row.row.index + 1,
        enableSorting: true,
        enableGlobalFilter: false,
      }),
      columnHelper.accessor((row) => row.equipmentPriority, {
        id: 'equipmentPriority',
        header: t('biomech.main_page.priority_col'),
        cell: (row) => (
          <Badge bg={setPriority(row.getValue())}>{t(`biomech.priority.${row.getValue()}`)}</Badge>
        ),
      }),
      columnHelper.accessor((row) => row.equipmentStatus, {
        id: 'equipmentStatus',
        header: t('biomech.main_page.status_col'),
        cell: (row) => (
          <Badge bg={setStatusBadgeColor(row.getValue())}>
            {t(`biomech.status.${row.getValue()}`)}
          </Badge>
        ),
      }),
      columnHelper.accessor((row) => row.equipmentName, {
        id: 'equipmentName',
        header: t('biomech.main_page.equipment_col'),
        cell: (row) => row.getValue(),
      }),
      columnHelper.accessor((row) => (row.user ? row.user.name : t('status.not_available')), {
        id: 'equipmentLocation',
        header: t('biomech.main_page.author_col'),
      }),
      columnHelper.accessor(
        (row) =>
          row.createdAt.toLocaleString(language, {
            timeZone: timezone,
          }),
        {
          id: 'createdAt',
          header: t('biomech.main_page.created_col'),
          enableGlobalFilter: false,
        },
      ),
      columnHelper.accessor((row) => row.id, {
        id: 'Options',
        header: t('biomech.main_page.options_col'),
        enableGlobalFilter: false,
        cell: (row) => (
          <>
            <button
              data-testid="view-biomech-button"
              className="btn btn-link text-decoration-none d-inline"
              onClick={() => history.push(`${Paths.getBioMechViewId(row.getValue())}`)}
            >
              {t(`button.view`)}
            </button>
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
              <button
                data-testid="delete-biomech-button"
                className="btn btn-link text-decoration-none d-inline"
                onClick={(event) => {
                  onDeleteBioMech(event, row.getValue());
                }}
              >
                {t(`button.delete`)}
              </button>
            ) : (
              <></>
            )}
          </>
        ),
      }),
    ],
    [authState.userDetails.role, history, t],
  );

  const deleteBioMechActions = () => {
    toast.success(ResponseMessage.getMsgDeleteReportOk());
    getBioReport();
  };

  const getBioReport = useCallback(
    async (controller?: AbortController) => {
      const data = await Api.Get(
        ENDPOINT_BIOMECH_GET,
        ResponseMessage.getMsgFetchReportsFailed(),
        history,
        controller && controller.signal,
      );

      setBioReport(data);
    },
    [history],
  );

  const deleteBioMech = async (id: string) => {
    await Api.Delete(
      ENDPOINT_BIOMECH_DELETE_BY_ID(id),
      {},
      deleteBioMechActions,
      ResponseMessage.getMsgDeleteReportFailed(),
      history,
    );
  };

  const onDeleteBioMech = (event: any, id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(id);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(null);
    setDeleteModal(false);
  };

  const onModalDelete = (id: string) => {
    deleteBioMech(id);
    setDeleteModal(false);
  };

  useEffect(() => {
    const controller = new AbortController();
    getBioReport(controller);

    return () => controller.abort();
  }, [getBioReport]);

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
            <FilterableTable data={BioReport} columns={columns} enableGlobalFilter />
          </div>
        </section>
      </Layout>
    </div>
  );
};
