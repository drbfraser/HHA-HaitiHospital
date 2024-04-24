import { Role } from '@hha/common';
import { CellContext } from '@tanstack/react-table';
import { renderBasedOnRole } from 'actions/roleActions';
import { deleteCaseStudy, featureCaseStudy, getAllCaseStudies } from 'api/caseStudy';
import Layout from 'components/layout';
import DeleteModal from 'components/popup_modal/DeleteModal';
import GenericModal from 'components/popup_modal/GenericModal';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { toI18nDateString } from 'constants/date';
import { useAuthState } from 'contexts';
import { History } from 'history';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';
import { Link, useHistory } from 'react-router-dom';
import { SortOrder } from 'utils';
import { CaseStudy } from './typing';

export enum CaseStudyCol {
  AUTHOR,
  CREATED_AT,
  TYPE,
}
export type CaseStudySortOrder = SortOrder<CaseStudyCol>;

export const CaseStudyList = () => {
  // TODO: Create a "CaseStudy" type (instead of using "any")
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [currentIndex, setCurrentIndex] = useState<string>();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isWarningModalOpen, setIsWarningModelOpen] = useState<boolean>(false);

  const authState = useAuthState();
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const resetModals = () => {
    setCurrentIndex(undefined);
    setIsDeleteModalOpen(false);
    setIsWarningModelOpen(false);
  };

  const deleteCaseStudyById = async (id: string) => deleteCaseStudy(id, resetModals, history);

  const onModalDeleteConfirm = async () => {
    if (currentIndex) {
      await deleteCaseStudyById(currentIndex);
    }
    setCaseStudies(caseStudies.filter((item: any) => item.id !== currentIndex));
    resetModals();
  };

  const getAllCaseStudiesCallback = useCallback(async () => {
    const data = await getAllCaseStudies(history);
    setCaseStudies(data);
  }, [history]);

  useEffect(() => {
    getAllCaseStudiesCallback();
  }, [getAllCaseStudiesCallback]);

  const columns = useMemo(() => {
    const onDeleteButton = (event: any, item: any) => {
      event.stopPropagation();
      event.preventDefault();

      setCurrentIndex(item.id);
      item.featured ? setIsWarningModelOpen(true) : setIsDeleteModalOpen(true);
    };

    const columns: FilterableColumnDef[] = [
      {
        header: t('CaseStudy.Main.CaseStudyType'),
        id: 'type',
        cell: (row) => t(`CaseStudy.Type.${row.getValue()}`),
        accessorKey: 'caseStudyType',
        filterFn: () => true,
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
        cell: (row) => toI18nDateString(row.row.original.createdAt, i18n.resolvedLanguage),
      },
    ];

    if (renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector])) {
      columns.push({
        header: 'Actions',
        id: 'featured',
        enableColumnFilter: false,
        enableSorting: false,
        cell: (row: CellContext<any, any>) => {
          const item = row.row.original;

          return (
            <>
              <Button
                data-testid="feature-case-study-button"
                onClick={async (event) => {
                  event.stopPropagation();

                  await featureCaseStudy(item.id, () => history.push('/case-study'), history);

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
  }, [authState.userDetails.role, history, i18n.resolvedLanguage, t]);

  return (
    <Layout title={t('headerCaseStudy')}>
      <GenericModal
        dataTestId="reminder-to-change-featured-before-deleting"
        show={isWarningModalOpen}
        item={'case study'}
        message={
          'Please select another case study to feature before deleting the featured case study'
        }
        onModalClose={resetModals}
      />
      <DeleteModal
        dataTestId="confirm-delete-case-study-button"
        show={isDeleteModalOpen}
        itemName={'case study'}
        onModalClose={resetModals}
        onModalDelete={onModalDeleteConfirm}
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
      <div data-testid="case-study-table">
        <FilterableTable
          columns={columns}
          data={caseStudies}
          rowClickHandler={(item) => history.push(`/case-study/view/${item.id}`)}
          enableFilters
          enableGlobalFilter
          enableSorting
        />
      </div>
    </Layout>
  );
};
