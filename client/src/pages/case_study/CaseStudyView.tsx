import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { CaseStudySummary } from 'components/case_study/CaseStudySummary';
import { History } from 'history';
import Layout from 'components/layout';
import { getCaseStudyById } from 'api/caseStudy';

export const CaseStudyView = () => {
  const [caseStudy, setCaseStudy] = useState({} as any);
  const id: string = useLocation().pathname.split('/')[3];
  const history: History = useHistory<History>();
  const [title, setTitle] = useState('');

  const getCaseStudy = useCallback(async () => {
    const caseStudy = await getCaseStudyById(id, history);
    setCaseStudy(caseStudy);
  }, [id, history]);

  useEffect(() => {
    getCaseStudy();
  }, [getCaseStudy]);

  return (
    <Layout showBackButton title={title}>
      <CaseStudySummary caseStudy={caseStudy} setTitle={setTitle} />
    </Layout>
  );
};
