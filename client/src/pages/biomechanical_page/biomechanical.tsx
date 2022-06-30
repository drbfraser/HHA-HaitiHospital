import { useEffect, useState, useMemo, useCallback } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Badge } from 'react-bootstrap';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import Api from 'actions/Api';
import { ENDPOINT_BIOMECH_GET, ENDPOINT_BIOMECH_DELETE_BY_ID } from 'constants/endpoints';
import { TOAST_BIOMECH_GET, TOAST_BIOMECH_DELETE } from 'constants/toast_messages';
import { toast } from 'react-toastify';
import { renderBasedOnRole } from 'actions/roleActions';
import './biomechanical.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'contexts';
import Pagination from 'components/pagination/Pagination';
import { History } from 'history';
import { setPriority } from 'pages/broken_kit_report/BiomechModel';
import { timezone, language } from 'constants/timezones';
import { Paths } from 'constants/paths';

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
    toast.success('Bio Mech request deleted!');
    getBioReport();
  };

  const getBioReport = useCallback(
    async () => {
        setBioReport(await Api.Get(ENDPOINT_BIOMECH_GET, TOAST_BIOMECH_GET, history));
    }, 
    [history]
  );

  const deleteBioMech = async (id: string) => {
    await Api.Delete(
      ENDPOINT_BIOMECH_DELETE_BY_ID(id),
      {},
      deleteBioMechActions,
      TOAST_BIOMECH_DELETE,
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
  }, [getBioReport]);

  return (
    <div className="biomechanical_page">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <ModalDelete
          currentItem={currentIndex}
          show={deleteModal}
          item={'biomech report'}
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
                <button type="button" className="btn btn-outline-dark">
                  {t('bioSupportReportBrokenKit')}
                </button>
              </Link>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">{t('bioSupportReportPriority')}</th>
                    <th scope="col">{t('bioSupportReportAuthor')}</th>
                    <th scope="col">{t('bioSupportReportCreated')}</th>
                    <th scope="col">{t('bioSupportReportOptions')}</th>
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
                              {item.equipmentPriority}
                            </Badge>
                          }
                        </td>
                        <td>{item.user ? item.user.name : '[deleted]'}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleString(language, {
                            timeZone: timezone,
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-link text-decoration-none d-inline"
                            onClick={() => history.push(`${Paths.getBioMechViewId(item.id)}`)}
                          >
                            {t('brokenKitReportView')}
                          </button>
                          {renderBasedOnRole(authState.userDetails.role, [
                            Role.Admin,
                            Role.MedicalDirector,
                          ]) ? (
                            <button
                              className="btn btn-link text-decoration-none d-inline"
                              onClick={(event) => {
                                onDeleteBioMech(event, item.id);
                              }}
                            >
                              {t('brokenKitReportDelete')}
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
