import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import {
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
} from 'constants/endpoints';
import { Link, useHistory } from 'react-router-dom';
import { SortOrder, isDateStrInDayRange, sortCaseStudies } from 'utils';
import {
  TOAST_CASESTUDY_DELETE,
  TOAST_CASESTUDY_GET,
  TOAST_CASESTUDY_PATCH,
} from 'constants/toastErrorMessages';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { History } from 'history';
import HoverableTableHead from 'components/table/HoverableTableHead';
import Layout from 'components/layout';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import ModalGeneric from 'components/popup_modal/popup_modal_generic';
import Pagination from 'components/pagination/Pagination';
import { Role } from 'constants/interfaces';
import cn from 'classnames';
import i18n from 'i18next';
import { renderBasedOnRole } from 'actions/roleActions';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

const PAGE_SIZE = 10;

export enum CaseStudyCol {
  AUTHOR,
  CREATED_AT,
  TYPE,
}
export type CaseStudySortOrder = SortOrder<CaseStudyCol>;

export const CaseStudyMain = () => {
  const DEFAULT_INDEX: string = '';
  // TODO: Create a "CaseStudy" type (instead of using "any")
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [dayRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [genericModal, setGenericModal] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<CaseStudySortOrder>({
    column: CaseStudyCol.CREATED_AT,
    isAscDir: true,
  });
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const caseStudyNumberIndex = currentPage * PAGE_SIZE - PAGE_SIZE;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * PAGE_SIZE;
    const lastPageIndex = firstPageIndex + PAGE_SIZE;

    return caseStudies
      .slice(firstPageIndex, lastPageIndex)
      .filter((caseStudy) => {
        const createdAtLabel = caseStudy.createdAt.split(' ').slice(0, 3).join(' ');
        return isDateStrInDayRange(createdAtLabel, dayRange);
      })
      .sort((prevCaseStudy, nextCaseStudy) => {
        return sortCaseStudies(prevCaseStudy, nextCaseStudy, sortOrder);
      });
  }, [caseStudies, currentPage, dayRange, sortOrder]);

  const onFeatureCaseStudy = () => {
    toast.success('Featured case study has now changed!');
    fetchCaseStudies();
  };

  const onDeleteCaseStudy = () => {
    toast.success('Case Study deleted!');
    fetchCaseStudies();
  };

  const fetchCaseStudies = useCallback(async () => {
    const controller = new AbortController();
    setCaseStudies(
      await Api.Get(ENDPOINT_CASESTUDY_GET, TOAST_CASESTUDY_GET, history, controller.signal),
    );
    return () => {
      controller.abort();
      setCaseStudies([]);
    };
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

  useEffect(() => {
    fetchCaseStudies();
  }, [fetchCaseStudies]);

  return (
    <div className="case-study-main">
      <Layout>
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
        />
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
        />
        <div className="w-100">
          <Link to="/case-study/form">
            <button
              className="btn btn-outline-dark"
              data-testid="add-case-study-button"
              type="button"
            >
              {t('caseStudyMainAddCaseStudy')}
            </button>
          </Link>
        </div>
        <div className="w-100 mt-3">
          <DatePicker onChange={setDayRange} shouldHighlightWeekends value={dayRange} />
        </div>
        <div className="table-responsive">
          <table className="table table-hover mt-2">
            <thead>
              <tr>
                <th scope="col">#</th>
                <HoverableTableHead
                  data-testid="case-study-type-title"
                  onClick={() => {
                    setSortOrder({
                      column: CaseStudyCol.TYPE,
                      isAscDir: sortOrder.column === CaseStudyCol.TYPE ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                >
                  <div className="d-flex align-items-center gap-2">
                    {t('caseStudyMainCaseStudyType')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== CaseStudyCol.TYPE,
                        'bi-arrow-down':
                          sortOrder.column === CaseStudyCol.TYPE && !sortOrder.isAscDir,
                        'bi-arrow-up': sortOrder.column === CaseStudyCol.TYPE && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </HoverableTableHead>
                <HoverableTableHead
                  data-testid="case-study-author-title"
                  onClick={() => {
                    setSortOrder({
                      column: CaseStudyCol.AUTHOR,
                      isAscDir:
                        sortOrder.column === CaseStudyCol.AUTHOR ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                >
                  <div className="d-flex align-items-center gap-2">
                    {t('caseStudyMainAuthor')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== CaseStudyCol.AUTHOR,
                        'bi-arrow-down':
                          sortOrder.column === CaseStudyCol.AUTHOR && !sortOrder.isAscDir,
                        'bi-arrow-up':
                          sortOrder.column === CaseStudyCol.AUTHOR && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </HoverableTableHead>
                <HoverableTableHead
                  data-testid="case-study-created-title"
                  onClick={() => {
                    setSortOrder({
                      column: CaseStudyCol.CREATED_AT,
                      isAscDir:
                        sortOrder.column === CaseStudyCol.CREATED_AT ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                >
                  <div className="d-flex align-items-center gap-2">
                    {t('caseStudyMainCreated')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== CaseStudyCol.CREATED_AT,
                        'bi-arrow-down':
                          sortOrder.column === CaseStudyCol.CREATED_AT && !sortOrder.isAscDir,
                        'bi-arrow-up':
                          sortOrder.column === CaseStudyCol.CREATED_AT && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </HoverableTableHead>
                <th data-testid="case-study-options-title" scope="col">
                  {t('caseStudyMainLink')}
                </th>
              </tr>
            </thead>
            <tbody>
              {currentTableData.map((item, index) => {
                return (
                  <tr
                    key={item.id}
                    onClick={() => history.push(`/case-study/view/${item.id}`)}
                    role="button"
                  >
                    <th scope="row">{caseStudyNumberIndex + index + 1}</th>
                    <td>{i18n.t(item.caseStudyType)}</td>
                    <td>{!!item.user ? item.user.name : t('status.not_available')}</td>
                    <td>{item.createdAt}</td>
                    <td>
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
                          {t('caseStudyMainDelete').concat(' ')}
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
                            ? t('caseStudyMainUnFeatured')
                            : t('caseStudyMainFeatured')}
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
            pageSize={PAGE_SIZE}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      </Layout>
    </div>
  );
};
