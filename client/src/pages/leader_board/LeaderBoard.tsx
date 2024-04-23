import { useCallback, useEffect, useState } from 'react';

import { LeaderboardJson as Leaderboard } from '@hha/common';
import { getFeaturedCaseStudy } from 'api/caseStudy';
import { getLeaderboard } from 'api/leaderboard';
import { CaseStudySummary } from 'components/case_study/CaseStudySummary';
import Layout from 'components/layout';
import { History } from 'history';
import { CaseStudy } from 'pages/case_study/typing';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

export const LeaderBoard = () => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([]);
  const [caseStudy, setCaseStudy] = useState<CaseStudy>();
  const history: History = useHistory<History>();

  const fetchData = useCallback(async () => {
    const leaderboard = await getLeaderboard(history);
    const caseStudy = await getFeaturedCaseStudy(history);
    setLeaderboard(leaderboard);
    setCaseStudy(caseStudy);
  }, [history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Layout title={t('headerLeaderBoard')}>
      <div className="my-3 p-2 bg-body rounded shadow-sm">
        <h5 className="mb-3">{t('leaderBoardDepartmentLeaderboard')}</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '5%' }} className="text-center">
                  {t('leaderBoardPosition')}
                </th>
                <th scope="col" style={{ width: '10%' }} className="text-center"></th>
                <th scope="col" className="text-center">
                  {t('leaderBoardDepartment')}
                </th>
                <th
                  scope="col"
                  style={{ width: '15%' }}
                  className="d-none d-sm-table-cell text-center"
                >
                  {t('leaderBoardCase Studies')}
                </th>
                <th scope="col" className="text-center">
                  {t('leaderBoardPoints')}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => (
                <tr key={index} className={`${index === 0 ? 'table-warning' : ''}`}>
                  <th scope="row" className="text-center">
                    {index + 1}
                  </th>
                  <td className="text-center">
                    {index === 0 ? <i className="text-warning bi-trophy-fill" /> : null}
                    {index === 1 ? <i className="text-secondary bi-trophy-fill" /> : null}
                    {index === 2 ? <i className="text-danger bi-trophy-fill" /> : null}
                  </td>
                  <td className="text-center">{t(`departments.${item.name}`)}</td>
                  <td className="d-none d-sm-table-cell text-center">{item.nCaseStudies}</td>
                  <td className="fw-bold text-center">{item.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {caseStudy && (
        <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
          <CaseStudySummary caseStudy={caseStudy} />
        </div>
      )}
    </Layout>
  );
};
