import { useEffect, useState } from 'react';
import { RouteComponentProps, useLocation, Link } from 'react-router-dom';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import axios from 'axios';
import { CaseStudyOptions } from '../case_study_forms/CaseStudies';
import { useTranslation } from 'react-i18next';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState({} as any);
  const id = useLocation().pathname.split('/')[3];
  const caseStudyUrl = `/api/case-studies/${id}`;

  useEffect(() => {
    const getCaseStudy = async () => {
      const res = await axios.get(caseStudyUrl);
      setCaseStudy(res.data);
    };

    getCaseStudy();
  }, [caseStudyUrl]);

  const { t: translateText } = useTranslation();

  return (
    <div className={'case-study-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 d-flex justify-content-start">
          <Link to="/case-study">
            <button type="button" className="btn btn-outline-dark">
              {translateText('caseStudyFormBack')}
            </button>
          </Link>
        </div>
        <CaseStudySummary caseStudy={caseStudy} />
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
