import { useEffect, useState, useMemo } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { Role } from 'constants/interfaces';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import ModalGeneric from 'components/popup_modal/popup_modal_generic';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import Api from 'actions/Api';
import {
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
} from 'constants/endpoints';
import {
  TOAST_CASESTUDY_GET,
  TOAST_CASESTUDY_DELETE,
  TOAST_CASESTUDY_PATCH,
} from 'constants/toast_messages';
import { toast } from 'react-toastify';
import './case_study_main_styles.css';
import { useTranslation } from 'react-i18next';
import { useAuthState } from 'contexts';
import { renderBasedOnRole } from 'actions/roleActions';
import i18n from 'i18next';
import Pagination from 'components/pagination/Pagination';
import { History } from 'history';
import { timezone, language } from 'constants/timezones';

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const DEFAULT_INDEX: string = '';
  const [genericModal, setGenericModal] = useState<boolean>(false);
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [caseStudies, setCaseStudies] = useState([]);
  const authState = useAuthState();
  const history: History = useHistory<History>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return caseStudies.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, caseStudies]);
  const caseStudyNumberIndex = currentPage * pageSize - pageSize;

  const featureCaseStudyActions = () => {
    toast.success('Featured case study has now changed!');
  };

  const deleteCaseStudyActions = () => {
    toast.success('Case Study deleted!');
  };

  const getCaseStudies = async () => {
    setCaseStudies(await Api.Get(ENDPOINT_CASESTUDY_GET, TOAST_CASESTUDY_GET, history));
  };

  const deleteCaseStudy = async (id: string) => {
    await Api.Delete(
      ENDPOINT_CASESTUDY_DELETE_BY_ID(id),
      {},
      deleteCaseStudyActions,
      TOAST_CASESTUDY_DELETE,
      history,
    );
  };

  const featureCaseStudy = async (id: string) => {
    await Api.Patch(
      ENDPOINT_CASESTUDY_PATCH_BY_ID(id),
      {},
      featureCaseStudyActions,
      TOAST_CASESTUDY_PATCH,
      history,
    );
  };

  const onDeleteCaseStudy = (event: any, item: any) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(item._id);
    item.featured ? setGenericModal(true) : setDeleteModal(true);
  };

  const onModalGenericClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setGenericModal(false);
  };

  const onModalDeleteClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = (id: string) => {
    deleteCaseStudy(id);
    setDeleteModal(false);
  };

  useEffect(() => {
    getCaseStudies();
  }, [caseStudies]);

  const { t: translateText } = useTranslation();

  return (
    <div className="case-study-main">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <ModalGeneric
          show={genericModal}
          item={'case study'}
          message={
            'Please select another case study to feature before deleting the featured case study'
          }
          onModalClose={onModalGenericClose}
          history={history}
          location={undefined}
          match={undefined}
        ></ModalGeneric>
        <ModalDelete
          currentItem={currentIndex}
          show={deleteModal}
          item={'case study'}
          onModalClose={onModalDeleteClose}
          onModalDelete={onModalDelete}
          history={history}
          location={undefined}
          match={undefined}
        ></ModalDelete>
        <div className="d-flex justify-content-start">
          <Link to="/case-study/form">
            <button type="button" className="btn btn-outline-dark">
              {translateText('caseStudyMainAddCaseStudy')}
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{translateText('caseStudyMainCaseStudyType')}</th>
                <th scope="col">{translateText('caseStudyMainAuthor')}</th>
                <th scope="col">{translateText('caseStudyMainCreated')}</th>
                <th scope="col">{translateText('caseStudyMainLink')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((item, index) => {
                return (
                  <tr key={item._id}>
                    <th scope="row">{caseStudyNumberIndex + index + 1}</th>
                    <td>{i18n.t(item.caseStudyType)}</td>
                    <td>{item.user ? item.user.name : '[deleted]'}</td>
                    <td>
                      {new Date(item.createdAt).toLocaleString(language, {
                        timeZone: timezone,
                      })}
                    </td>
                    <td>
                      <button
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/case-study/view/${item._id}`)}
                      >
                        {translateText('caseStudyMainViewCaseStudy').concat(' ')}
                      </button>

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          className="btn btn-link text-decoration-none"
                          onClick={(event) => {
                            onDeleteCaseStudy(event, item);
                          }}
                        >
                          {translateText('caseStudyMainDelete').concat(' ')}
                        </button>
                      ) : null}

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          className="btn btn-link text-decoration-none"
                          disabled={item.featured}
                          style={item.featured ? { fontStyle: 'italic' } : {}}
                          onClick={() => (item.featured ? undefined : featureCaseStudy(item._id))}
                        >
                          {item.featured
                            ? translateText('caseStudyMainUnFeatured')
                            : translateText('caseStudyMainFeatured')}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination
            className="pagination-bar"
            currentPage={currentPage}
            totalCount={caseStudies.length}
            pageSize={pageSize}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </main>
    </div>
  );
};
