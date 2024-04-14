import {
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
} from 'constants/endpoints';
import FilterableTable, { FilterableColumnDef } from 'components/table/FilterableTable';
import { Link, useHistory } from 'react-router-dom';
import { TOAST_CASESTUDY_GET_ERROR } from 'constants/toastErrorMessages';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { Button } from 'react-bootstrap';
import { CellContext, Row } from '@tanstack/react-table';
import DeleteModal from 'components/popup_modal/DeleteModal';
import GenericModal from 'components/popup_modal/GenericModal';
import { History } from 'history';
import Layout from 'components/layout';
import { Role } from '@hha/common';
import { ResponseMessage, SortOrder } from 'utils';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { CaseStudy } from './typing';
import { toI18nDateString } from 'constants/date';

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

  const deleteCaseStudy = async (id: string) => {
    await Api.Delete(
      ENDPOINT_CASESTUDY_DELETE_BY_ID(id),
      {},
      resetModals,
      history,
      ResponseMessage.getMsgDeleteCaseStudyFailed(),
      undefined,
      ResponseMessage.getMsgDeleteCaseStudyOk(),
    );
  };

  const resetModals = () => {
    setCurrentIndex(undefined);
    setIsDeleteModalOpen(false);
    setIsWarningModelOpen(false);
  };

  const onModalDeleteConfirm = async () => {
    if (currentIndex) {
      await deleteCaseStudy(currentIndex);
    }
    setCaseStudies(caseStudies.filter((item: any) => item.id !== currentIndex));
    resetModals();
  };

  const columns = useMemo(() => {
    const featureCaseStudy = async (id: string) => {
      await Api.Patch(
        ENDPOINT_CASESTUDY_PATCH_BY_ID(id),
        {},
        () => {
          history.push('/case-study');
        },
        history,
        ResponseMessage.getMsgFeatureCaseStudyFailed(),
        'Get case study pending',
        ResponseMessage.getMsgFeatureCaseStudyOk(),
      );
    };

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
        cell: (row) => t(`CaseStudy.Type.${row.row.original.caseStudyType}`),
        accessorFn: (row) => t(row.caseStudyType),
        // filterFn: (row: Row<any>, columnId: string, value: any) => {
        //   alert(row.getValue(columnId))
        //   console.log("A", row.getValue(columnId), value)
        //   return true;
        // },
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
      const data: CaseStudy[] = await Api.Get(
        ENDPOINT_CASESTUDY_GET,
        TOAST_CASESTUDY_GET_ERROR,
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
      <FilterableTable
        columns={columns}
        data={caseStudies}
        rowClickHandler={(item) => history.push(`/case-study/view/${item.id}`)}
        enableFilters
        enableGlobalFilter
        enableSorting
      />
    </Layout>
  );
};
