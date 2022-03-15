import { useState, useEffect } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';
import './leader_board_main.css';
import Api from 'actions/Api';
import { ENDPOINT_CASESTUDY_FEATURED, ENDPOINT_LEADERBOARD_GET } from 'constants/endpoints';
import { TOAST_CASESTUDY_GET, TOAST_LEADERBOARD_GET } from 'constants/toast_messages';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router';

interface LeaderBoardMainProps {}

export const LeaderBoardMain = (props: LeaderBoardMainProps) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [caseStudy, setCaseStudy] = useState({} as any);
  const history = useHistory<History>();

  const getLeaderboard = async () => {
    setLeaderboard(await Api.Get(ENDPOINT_LEADERBOARD_GET, TOAST_LEADERBOARD_GET, history));
  };

  const getCaseStudy = async () => {
    setCaseStudy(await Api.Get(ENDPOINT_CASESTUDY_FEATURED, TOAST_CASESTUDY_GET, history));
  };

  useEffect(() => {
    getLeaderboard();
    getCaseStudy();
  }, [history]);

  return (
    <div className={'leader-board-main'}>
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
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
                  <tr key={item._id} className={`${index === 0 ? 'table-warning' : ''}`}>
                    <th scope="row" className="text-center">
                      {index + 1}
                    </th>
                    <td className="text-center">
                      {index === 0 ? <i className="text-warning bi-trophy-fill" /> : null}
                      {index === 1 ? <i className="text-secondary bi-trophy-fill" /> : null}
                      {index === 2 ? <i className="text-danger bi-trophy-fill" /> : null}
                    </td>
                    <td className="text-center">{item.name}</td>
                    <td className="d-none d-sm-table-cell text-center">{item.nCaseStudies}</td>
                    <td className="fw-bold text-center">{item.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {JSON.stringify(caseStudy) !== '{}' && (
          <div className="my-3 p-2 bg-body rounded shadow-sm mb-3">
            <CaseStudySummary caseStudy={caseStudy} />
          </div>
        )}
      </main>
    </div>
  );
};
