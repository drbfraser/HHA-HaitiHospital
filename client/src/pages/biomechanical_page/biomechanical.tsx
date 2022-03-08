import { useCallback, useEffect, useState, useMemo } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import axios from 'axios';
import { toast } from 'react-toastify';
import { renderBasedOnRole } from 'actions/roleActions';
import './biomechanical.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'Context';
import Pagination from 'components/pagination/Pagination';

interface BiomechanicalPageProps extends RouteComponentProps {}

export const BiomechanicalPage = (props: BiomechanicalPageProps) => {
  const { t } = useTranslation();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [BioReport, setBioReport] = useState([]);
  const authState = useAuthState();
  const history = useHistory();
  const BioReportUrl = `/api/biomech/`;
  const [currentPage, setCurrentPage] = useState(1);
  const PageSize = 5;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PageSize;
    const lastPageIndex = firstPageIndex + PageSize;
    return BioReport.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, BioReport]);
  const ValueIndex = (currentPage * PageSize) - PageSize;

  const getBioReport = useCallback(async () => {
    const res = await axios.get(BioReportUrl);
    setBioReport(res.data);
  }, [BioReportUrl]);

  const deleteBioMech = async (id: string) => {
    try {
      toast.success('Bio Mech request deleted!');
      await axios.delete(BioReportUrl.concat(`/${id}`));
      getBioReport();
    } catch (err) {
      toast.error('Unable to delete Bio Mech Request!');
    }
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
        ></ModalDelete>

        <section>
          <div className="row my-2 justify-items-center">
            <div className="col-sm-6 col-md-6 col-lg-6">
              <Link to={'/biomechanic/report_broken_kit'}>
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
                      <tr key={item._id}>
                        <th scope="row">{ValueIndex + index + 1}</th>
                        <td>{item.equipmentPriority}</td>
                        <td>{item.user ? item.user.name : '[deleted]'}</td>
                        <td>
                          {new Date(item.createdAt).toLocaleString('en-US', {
                            timeZone: 'America/Cancun',
                          })}
                        </td>
                        <td>
                          <button
                            className="btn btn-link text-decoration-none d-inline"
                            onClick={() => history.push(`/biomechanic/view/${item._id}`)}
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
                                onDeleteBioMech(event, item._id);
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
                  <Pagination
                    className="pagination-bar"
                    currentPage={currentPage}
                    totalCount={BioReport.length}
                    pageSize={PageSize}
                    onPageChange={page => setCurrentPage(page)}
                  />
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};
