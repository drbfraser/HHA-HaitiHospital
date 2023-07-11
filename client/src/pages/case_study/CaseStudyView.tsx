import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Api from 'actions/Api';
import { CaseStudySummary } from 'components/case_study/CaseStudySummary';
import { ENDPOINT_CASESTUDY_GET_BY_ID } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import { TOAST_CASESTUDY_GET } from 'constants/toastErrorMessages';

export const CaseStudyView = () => {
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

  return (
    <Layout showBackButton>
      <CaseStudySummary caseStudy={caseStudy} />
    </Layout>
  );
};
