import { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link, useHistory } from 'react-router-dom';
import Layout from 'components/layout';
import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_GET_BY_ID } from 'constants/endpoints';
import { TOAST_CASESTUDY_GET } from 'constants/toastErrorMessages';
import { useTranslation } from 'react-i18next';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';
import { History } from 'history';

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState({} as any);
  const id: string = useLocation().pathname.split('/')[3];
  const history: History = useHistory<History>();

  useEffect(
    function fetchCaseStudyInitially() {
      const controller = new AbortController();

      const getCaseStudy = async () => {
        setCaseStudy(
          await Api.Get(
            ENDPOINT_CASESTUDY_GET_BY_ID(id),
            TOAST_CASESTUDY_GET,
            history,
            controller.signal,
          ),
        );
      };
      getCaseStudy();
      return () => {
        controller.abort();
      };
    },
    [history, id],
  );

  const { t: translateText } = useTranslation();

  return (
    <div className="case-study-main">
      <Layout>
        <div className="d-flex justify-content-start">
          <Link to="/case-study">
            <button type="button" className="btn btn-outline-dark">
              {translateText('caseStudyFormBack')}
            </button>
          </Link>
        </div>
        <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
          <CaseStudySummary caseStudy={caseStudy} />
        </div>
        {document.documentElement.scrollHeight > window.innerHeight && (
          <div className="ml-3 mb-5 d-flex justify-content-start">
            <Link to="/case-study">
              <button type="button" className="btn btn-outline-dark">
                {translateText('caseStudyFormBack')}
              </button>
            </Link>
          </div>
        )}
      </Layout>
    </div>
  );
};
