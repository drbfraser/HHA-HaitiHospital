import './main.css';

import { Badge, Button } from 'react-bootstrap';
import { ENDPOINT_BIOMECH_DELETE_BY_ID, ENDPOINT_BIOMECH_GET } from 'constants/endpoints';
import { Link, RouteComponentProps, useHistory } from 'react-router-dom';
import { setPriority, setStatusBadgeColor } from 'pages/biomech/utils';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { ColumnDef } from '@tanstack/react-table';
import FilterableTable from 'components/table/FilterableTable';
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

export const BiomechanicalPage = (_: Props) => {
  const { t } = useTranslation();
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [BioReport, setBioReport] = useState([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();

  const columns = useMemo(
    (): ColumnDef<any, any>[] => [
      {
        header: '#',
        cell: (row) => row.row.index + 1,
        enableSorting: true,
        enableGlobalFilter: false,
      },
      {
        id: 'equipmentPriority',
        header: t('biomech.main_page.priority_col'),
        cell: (row) => (
          <Badge bg={setPriority(row.getValue())}>{t(`biomech.priority.${row.getValue()}`)}</Badge>
        ),
        accessorKey: 'equipmentPriority',
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
        cell: (row) => (
          <>
            <Button
              data-testid="view-biomech-button"
              onClick={() => history.push(`${Paths.getBioMechViewId(row.getValue())}`)}
              variant="link"
              className="text-decoration-none"
            >
              {t(`button.view`)}
            </Button>
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
              <Button
                data-testid="delete-biomech-button"
                onClick={(event) => onDeleteBioMech(event, row.getValue())}
                variant="link"
                className="text-decoration-none"
              >
                {t(`button.delete`)}
              </Button>
            ) : (
              <></>
            )}
          </>
        ),
        accessorKey: 'id',
      },
    ],
    [authState.userDetails.role, history, t],
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

  const onDeleteBioMech = (_: any, id: string) => {
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
            <FilterableTable data={BioReport} columns={columns} enableGlobalFilter />
          </div>
        </section>
      </Layout>
    </div>
  );
};
