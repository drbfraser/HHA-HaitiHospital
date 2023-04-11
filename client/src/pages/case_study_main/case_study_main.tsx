import './case_study_main_styles.css';
import Api from 'actions/Api';
import DatePicker, { DayRange } from 'react-modern-calendar-datepicker';
import Header from 'components/header/header';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import ModalGeneric from 'components/popup_modal/popup_modal_generic';
import Pagination from 'components/pagination/Pagination';
import SideBar from 'components/side_bar/side_bar';
import cn from 'classnames';
import i18n from 'i18next';
import {
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
} from 'constants/endpoints';
import { History } from 'history';
import { Role } from 'constants/interfaces';
import { Link, useHistory } from 'react-router-dom';
import {
  TOAST_CASESTUDY_DELETE,
  TOAST_CASESTUDY_GET,
  TOAST_CASESTUDY_PATCH,
} from 'constants/toastErrorMessages';
import { renderBasedOnRole } from 'actions/roleActions';
import { timezone, language } from 'constants/timezones';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useEffect, useState, useMemo, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

enum SortOrderCol {
  AUTHOR,
  CREATED_AT,
  TYPE,
}
type SortOrder = {
  column: SortOrderCol;
  isAscDir: boolean;
};

export const CaseStudyMain = () => {
  const DEFAULT_INDEX: string = '';
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const [dayRange, setDayRange] = useState<DayRange>({
    from: null,
    to: null,
  });
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [genericModal, setGenericModal] = useState<boolean>(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    column: SortOrderCol.CREATED_AT,
    isAscDir: true,
  });
  const authState = useAuthState();
  const history: History = useHistory<History>();

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;

    return caseStudies
      .slice(firstPageIndex, lastPageIndex)
      .filter((caseStudy) => {
        const createdAt = new Date(caseStudy.createdAt.split(' ').slice(0, 3).join(' '));
        const createdAtUTC = new Date(
          Date.UTC(createdAt.getFullYear(), createdAt.getMonth(), createdAt.getDate()),
        );

        if (dayRange.from) {
          const dayRangeFrom = new Date(
            Date.UTC(dayRange.from.year, dayRange.from.month - 1, dayRange.from.day),
          );
          return dayRangeFrom <= createdAtUTC;
        } else if (dayRange.to) {
          const dayRangeTo = new Date(
            Date.UTC(dayRange.to.year, dayRange.to.month - 1, dayRange.to.day),
          );
          return createdAtUTC <= dayRangeTo;
        } else if (dayRange.from && dayRange.to) {
          const dayRangeFrom = new Date(
            Date.UTC(dayRange.from.year, dayRange.from.month - 1, dayRange.from.day),
          );
          const dayRangeTo = new Date(
            Date.UTC(dayRange.to.year, dayRange.to.month - 1, dayRange.to.day),
          );

          return dayRangeFrom <= createdAtUTC && createdAtUTC <= dayRangeTo;
        }
        return true;
      })
      .sort((prevCaseStudy, nextCaseStudy) => {
        if (prevCaseStudy.featured) {
          return Number.NEGATIVE_INFINITY;
        } else if (sortOrder.column === SortOrderCol.AUTHOR) {
          return sortOrder.isAscDir
            ? prevCaseStudy.user.name.localeCompare(nextCaseStudy.user.name)
            : nextCaseStudy.user.name.localeCompare(prevCaseStudy.user.name);
        } else if (sortOrder.column === SortOrderCol.CREATED_AT) {
          const prevCreatedAt = new Date(prevCaseStudy.createdAt.split(' ').slice(0, 3).join(' '));
          const prevCreatedAtUTC = new Date(
            Date.UTC(
              prevCreatedAt.getFullYear(),
              prevCreatedAt.getMonth(),
              prevCreatedAt.getDate(),
            ),
          );
          const nextCreatedAt = new Date(nextCaseStudy.createdAt.split(' ').slice(0, 3).join(' '));
          const nextCreatedAtUTC = new Date(
            Date.UTC(
              nextCreatedAt.getFullYear(),
              nextCreatedAt.getMonth(),
              nextCreatedAt.getDate(),
            ),
          );

          return sortOrder.isAscDir
            ? prevCreatedAtUTC.getTime() - nextCreatedAtUTC.getTime()
            : nextCreatedAtUTC.getTime() - prevCreatedAtUTC.getTime();
        } else if (sortOrder.column === SortOrderCol.TYPE) {
          return sortOrder.isAscDir
            ? prevCaseStudy.caseStudyType.localeCompare(nextCaseStudy.caseStudyType)
            : nextCaseStudy.caseStudyType.localeCompare(prevCaseStudy.caseStudyType);
        }
        return 0;
      });
  }, [caseStudies, currentPage, dayRange, sortOrder]);
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
              {translateText('caseStudyMainAddCaseStudy')}
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
                <th
                  data-testid="case-study-type-title"
                  onClick={() => {
                    setSortOrder({
                      column: SortOrderCol.TYPE,
                      isAscDir: sortOrder.column === SortOrderCol.TYPE ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {translateText('caseStudyMainCaseStudyType')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== SortOrderCol.TYPE,
                        'bi-arrow-down':
                          sortOrder.column === SortOrderCol.TYPE && !sortOrder.isAscDir,
                        'bi-arrow-up': sortOrder.column === SortOrderCol.TYPE && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </th>
                <th
                  data-testid="case-study-author-title"
                  onClick={() => {
                    setSortOrder({
                      column: SortOrderCol.AUTHOR,
                      isAscDir:
                        sortOrder.column === SortOrderCol.AUTHOR ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {translateText('caseStudyMainAuthor')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== SortOrderCol.AUTHOR,
                        'bi-arrow-down':
                          sortOrder.column === SortOrderCol.AUTHOR && !sortOrder.isAscDir,
                        'bi-arrow-up':
                          sortOrder.column === SortOrderCol.AUTHOR && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </th>
                <th
                  data-testid="case-study-created-title"
                  onClick={() => {
                    setSortOrder({
                      column: SortOrderCol.CREATED_AT,
                      isAscDir:
                        sortOrder.column === SortOrderCol.CREATED_AT ? !sortOrder.isAscDir : true,
                    });
                  }}
                  scope="col"
                  style={{
                    cursor: 'pointer',
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    {translateText('caseStudyMainCreated')}
                    <i
                      className={cn('bi', {
                        'bi-arrow-down-up': sortOrder.column !== SortOrderCol.CREATED_AT,
                        'bi-arrow-down':
                          sortOrder.column === SortOrderCol.CREATED_AT && !sortOrder.isAscDir,
                        'bi-arrow-up':
                          sortOrder.column === SortOrderCol.CREATED_AT && sortOrder.isAscDir,
                      })}
                    />
                  </div>
                </th>
                <th data-testid="case-study-options-title" scope="col">
                  {translateText('caseStudyMainLink')}
                </th>
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
