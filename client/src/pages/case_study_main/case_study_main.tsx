import './case_study_main_styles.css';

import {
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
} from 'constants/endpoints';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import {
  TOAST_CASESTUDY_DELETE,
  TOAST_CASESTUDY_GET,
  TOAST_CASESTUDY_PATCH,
} from 'constants/toastErrorMessages';
import { useCallback, useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { Button } from 'react-bootstrap';
import { FilterType } from 'components/filter/Filter';
import { History } from 'history';
import Layout from 'components/layout';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import ModalGeneric from 'components/popup_modal/popup_modal_generic';
import { Role } from 'constants/interfaces';
import { SortOrder } from 'utils';
import { renderBasedOnRole } from 'actions/roleActions';
import { set } from 'lodash';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

export enum CaseStudyCol {
  AUTHOR,
  CREATED_AT,
  TYPE,
}
export type CaseStudySortOrder = SortOrder<CaseStudyCol>;

export const CaseStudyMain = () => {
  // TODO: Create a "CaseStudy" type (instead of using "any")
  const [caseStudies, setCaseStudies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [showWarningModal, setShowWarningModel] = useState<boolean>(false);
  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const deleteCaseStudy = async (id: string) => {
    await Api.Delete(
      ENDPOINT_CASESTUDY_DELETE_BY_ID(id),
      {},
      () => {
        toast.success('Case Study deleted!');
      },
      TOAST_CASESTUDY_DELETE,
      history,
    );
  };

  const resetDeleteModel = () => {
    setCurrentIndex(null);
    setShowDeleteModal(false);
  };

  const resetWarningModel = () => {
    setCurrentIndex(null);
    setShowWarningModel(false);
  };

  const onModalDeleteConfirm = async (id: string) => {
    await deleteCaseStudy(id);

    setCaseStudies(caseStudies.filter((item: any) => item.id !== id));

    resetDeleteModel();
  };

  const columns = useMemo(() => {
    const featureCaseStudy = async (id: string) => {
      await Api.Patch(
        ENDPOINT_CASESTUDY_PATCH_BY_ID(id),
        {},
        () => {
          toast.success('Featured case study has now changed!');
        },
        TOAST_CASESTUDY_PATCH,
        history,
      );
    };

    const onDeleteButton = (event: any, item: any) => {
      event.stopPropagation();
      event.preventDefault();

      setCurrentIndex(item.id);
      item.featured ? setShowWarningModel(true) : setShowDeleteModal(true);
    };

    const columns: FilterableColumnDef[] = [
      {
        header: t('CaseStudy.Main.CaseStudyType'),
        id: 'type',
        accessorKey: 'caseStudyType',
      },
      {
        header: t('CaseStudy.Main.Author'),
        id: 'author',
        accessorFn: (row) => row.user?.name ?? t('status.not_available'),
      },
      {
        header: t('CaseStudy.Main.Created'),
        id: 'createdAt',
        accessorKey: 'createdAt',
      },
    ];

    if (renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector])) {
      columns.push({
        header: 'Actions',
        id: 'featured',
        enableColumnFilter: false,
        enableSorting: false,
        cell: (row) => {
          const item = row.row.original;

          return (
            <>
              <Button
                data-testid="feature-case-study-button"
                onClick={async (event) => {
                  event.stopPropagation();

                  await featureCaseStudy(item.id);

                  setCaseStudies((caseStudies) => {
                    // Reorder the case studies so that the featured case study is first
                    const newCaseStudies = [
                      { ...item, featured: true },
                      ...caseStudies
                        .filter((caseStudy: any) => caseStudy.id !== item.id)
                        .map((caseStudy: any) => {
                          caseStudy.featured = false;
                          return caseStudy;
                        }),
                    ];

                    return newCaseStudies;
                  });
                }}
                disabled={item.featured}
                variant="link"
                title={t('button.')}
                className="text-decoration-none"
              >
                <i className={`bi ${item.featured ? 'bi-star-fill' : 'bi-star'}`}></i>
              </Button>
              <Button
                data-testid="delete-case-study-button"
                className="text-decoration-none"
                variant="link"
                onClick={(event) => {
                  onDeleteButton(event, item);
                }}
              >
                <i className="bi bi-trash"></i>
              </Button>
            </>
          );
        },
      });
    }

    return columns;
  }, [authState.userDetails.role, history, t]);

  useEffect(() => {
    const fetchCaseStudies = async (controller: AbortController) => {
      const data = await Api.Get(
        ENDPOINT_CASESTUDY_GET,
        TOAST_CASESTUDY_GET,
        history,
        controller.signal,
      );

      setCaseStudies(data);
    };

    const controller = new AbortController();

    fetchCaseStudies(controller);

    return () => {
      controller.abort();
    };
  }, [history]);

  return (
    <div className="case-study-main">
      <Layout>
        <ModalGeneric
          dataTestId="reminder-to-change-featured-before-deleting"
          show={showWarningModal}
          item={'case study'}
          message={
            'Please select another case study to feature before deleting the featured case study'
          }
          onModalClose={resetWarningModel}
          history={history}
          location={undefined}
          match={undefined}
        />
        <ModalDelete
          dataTestId="confirm-delete-case-study-button"
          currentItem={currentIndex}
          show={showDeleteModal}
          item={'case study'}
          onModalClose={resetDeleteModel}
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
              {t('CaseStudy.Main.AddCaseStudy')}
            </button>
          </Link>
        </div>
        <FilterableTable
          columns={columns}
          data={caseStudies}
          rowClickHandler={(item) => history.push(`/case-study/view/${item.id}`)}
          enableFilters
          enableGlobalFilter
          enableSorting
        />
      </Layout>
    </div>
  );
};
