import { useEffect, useState, useMemo, useCallback } from 'react';
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

  const onFeatureCaseStudy = () => {
    toast.success('Featured case study has now changed!');
    fetchCaseStudies();
  };

  const onDeleteCaseStudy = () => {
    toast.success('Case Study deleted!');
    fetchCaseStudies();
  };

  const fetchCaseStudies = useCallback(async () => {
    setCaseStudies(await Api.Get(ENDPOINT_CASESTUDY_GET, TOAST_CASESTUDY_GET, history));
  }, [history]);

  const deleteCaseStudy = async (id: string) => {
    await Api.Delete(
      ENDPOINT_CASESTUDY_DELETE_BY_ID(id),
      {},
      onDeleteCaseStudy,
      TOAST_CASESTUDY_DELETE,
      history,
    );
  };

  const featureCaseStudy = async (id: string) => {
    await Api.Patch(
      ENDPOINT_CASESTUDY_PATCH_BY_ID(id),
      {},
      onFeatureCaseStudy,
      TOAST_CASESTUDY_PATCH,
      history,
    );
  };

  const onDeleteButton = (event: any, item: any) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(item.id);
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

  const onModalDeleteConfirm = (id: string) => {
    deleteCaseStudy(id);
    setDeleteModal(false);
  };

  useEffect(
    function fetchCaseStudiesInitially() {
      fetchCaseStudies();
    },
    [fetchCaseStudies],
  );

  const { t: translateText } = useTranslation();

  return (
    <div className="case-study-main">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <ModalGeneric
          dataTestId="reminder-to-change-featured-before-deleting"
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
          dataTestId="confirm-delete-case-study-button"
          currentItem={currentIndex}
          show={deleteModal}
          item={'case study'}
          onModalClose={onModalDeleteClose}
          onModalDelete={onModalDeleteConfirm}
          history={history}
          location={undefined}
          match={undefined}
        ></ModalDelete>
        <div className="d-flex justify-content-start">
          <Link to="/case-study/form">
            <button
              data-testid="add-case-study-button"
              type="button"
              className="btn btn-outline-dark"
            >
              {translateText('caseStudyMainAddCaseStudy')}
            </button>
          </Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th data-testid="case-study-type-title" scope="col">{translateText('caseStudyMainCaseStudyType')}</th>
                <th data-testid="case-study-author-title" scope="col">{translateText('caseStudyMainAuthor')}</th>
                <th data-testid="case-study-created-title" scope="col">{translateText('caseStudyMainCreated')}</th>
                <th data-testid="case-study-options-title" scope="col">{translateText('caseStudyMainLink')}</th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((item, index) => {
                return (
                  <tr key={item.id}>
                    <th scope="row">{caseStudyNumberIndex + index + 1}</th>
                    <td>{i18n.t(item.caseStudyType)}</td>
                    <td>{item.user ? item.user.name : '[deleted]'}</td>
                    <td>
                      {item.createdAt.toLocaleString(language, {
                        timeZone: timezone,
                      })}
                    </td>
                    <td>
                      <button
                        data-testid="view-case-study-button"
                        className="btn btn-link text-decoration-none"
                        onClick={() => history.push(`/case-study/view/${item.id}`)}
                      >
                        {translateText('caseStudyMainViewCaseStudy').concat(' ')}
                      </button>

                      {renderBasedOnRole(authState.userDetails.role, [
                        Role.Admin,
                        Role.MedicalDirector,
                      ]) ? (
                        <button
                          data-testid="delete-case-study-button"
                          className="btn btn-link text-decoration-none"
                          onClick={(event) => {
                            onDeleteButton(event, item);
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
                          data-testid="feature-case-study-button"
                          className="btn btn-link text-decoration-none"
                          disabled={item.featured}
                          style={item.featured ? { fontStyle: 'italic' } : {}}
                          onClick={() => (item.featured ? undefined : featureCaseStudy(item.id))}
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
