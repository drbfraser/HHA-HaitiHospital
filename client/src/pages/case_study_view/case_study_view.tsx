import { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link, useHistory } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_GET_BY_ID } from 'constants/endpoints';
import { TOAST_CASESTUDY_GET } from 'constants/toast_messages';
import { useTranslation } from 'react-i18next';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';
import { History } from 'history';

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState({} as any);
  const id: string = useLocation().pathname.split('/')[3];
  const history: History = useHistory<History>();

  const getCaseStudy = async () => {
    setCaseStudy(await Api.Get(ENDPOINT_CASESTUDY_GET_BY_ID(id), TOAST_CASESTUDY_GET, history));
  };

  useEffect(() => {
    getCaseStudy();
  }, []);

  const { t: translateText } = useTranslation();

  return (
    <div className="case-study-main">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
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
        {caseStudy !== {} && document.documentElement.scrollHeight > window.innerHeight ? (
          <div className="ml-3 mb-5 d-flex justify-content-start">
            <Link to="/case-study">
              <button type="button" className="btn btn-outline-dark">
                {translateText('caseStudyFormBack')}
              </button>
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
};
