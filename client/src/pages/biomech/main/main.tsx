import { useEffect, useState, useMemo, useCallback } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import Api from 'actions/Api';
import { ENDPOINT_BIOMECH_GET, ENDPOINT_BIOMECH_DELETE_BY_ID } from 'constants/endpoints';
import { toast } from 'react-toastify';
import { renderBasedOnRole } from 'actions/roleActions';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'contexts';
import Pagination from 'components/pagination/Pagination';
import { History } from 'history';
import { setPriority, setStatusBadgeColor } from 'pages/biomech/utils';
import { timezone, language } from 'constants/timezones';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';

import './main.css';

interface BiomechanicalPageProps extends RouteComponentProps {}

export const BiomechanicalPage = (props: BiomechanicalPageProps) => {
  const { t } = useTranslation();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [BioReport, setBioReport] = useState([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();

  // Pagination
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return BioReport.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, BioReport]);
  const bioReportNumberIndex = currentPage * pageSize - pageSize;

  const deleteBioMechActions = () => {
    toast.success(ResponseMessage.getMsgDeleteReportOk());
    getBioReport();
  };

  const getBioReport = useCallback(async () => {
    const controller = new AbortController();
    setBioReport(
      await Api.Get(
        ENDPOINT_BIOMECH_GET,
        ResponseMessage.getMsgFetchReportsFailed(),
        history,
        controller.signal,
      ),
    );
    return () => {
      controller.abort();
      setBioReport([]);
    };
  }, [history]);

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
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = (id: string) => {
    deleteBioMech(id);
    setDeleteModal(false);
  };

  useEffect(() => {
    getBioReport();
    return () => {
      setBioReport([]);
    };
  }, [getBioReport]);

  return (
    <div className="biomechanical_page">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
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
            <div className="table-responsive">
              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">{t('biomech.main_page.priority_col')}</th>
                    <th scope="col">{t('biomech.main_page.status_col')}</th>
                    <th scope="col">{t('biomech.main_page.equipment_col')}</th>
                    <th scope="col">{t('biomech.main_page.author_col')}</th>
                    <th scope="col">{t('biomech.main_page.created_col')}</th>
                    <th scope="col">{t('biomech.main_page.options_col')}</th>
                  </tr>
                </thead>
                <tbody>
                  {currentTableData.map((item, index) => {
                    return (
                      <tr key={item.id}>
                        <th scope="row">{bioReportNumberIndex + index + 1}</th>
                        <td>
                          {
                            <Badge bg={setPriority(item.equipmentPriority)}>
                              {t(`biomech.priority.${item.equipmentPriority}`)}
                            </Badge>
                          }
                        </td>
                        <td>
                          <Badge bg={setStatusBadgeColor(item.equipmentStatus)}>
                            {item.equipmentStatus}
                          </Badge>
                        </td>
                        <td>{item.equipmentName}</td>
                        <td>{item.user ? item.user.name : t('status.not_available')} </td>
                        <td>
                          {item.createdAt.toLocaleString(language, {
                            timeZone: timezone,
                          })}
                        </td>
                        <td>
                          <button
                            data-testid="view-biomech-button"
                            className="btn btn-link text-decoration-none d-inline"
                            onClick={() => history.push(`${Paths.getBioMechViewId(item.id)}`)}
                          >
                            {t(`button.view`)}
                          </button>
                          {renderBasedOnRole(authState.userDetails.role, [
                            Role.Admin,
                            Role.MedicalDirector,
                          ]) ? (
                            <button
                              data-testid="delete-biomech-button"
                              className="btn btn-link text-decoration-none d-inline"
                              onClick={(event) => {
                                onDeleteBioMech(event, item.id);
                              }}
                            >
                              {t(`button.delete`)}
                            </button>
                          ) : (
                            <></>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={BioReport.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
