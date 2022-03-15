import { useState, useEffect } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { CaseStudySummary } from 'components/case_study_summary/case_study_summary';
import './leader_board_main.css';
import API from '../../actions/apiActions';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DbErrorHandler from 'actions/http_error_handler';
import { useHistory } from 'react-router';

interface LeaderBoardMainProps {}

export const LeaderBoardMain = (props: LeaderBoardMainProps) => {
  const { t } = useTranslation();
  const [leaderboard, setLeaderboard] = useState([]);
  const [caseStudy, setCaseStudy] = useState({} as any);
  const history = useHistory();
  const ENDPOINT_URL: string = '/api/leaderboard';

  const getLeaderboard = async () => {
    // setLeaderboard(await API.Get())

    const urlLeaderboard = '/api/leaderboard';
    try {
      const res = await axios.get(urlLeaderboard);
      setLeaderboard(res.data);
    } catch (err) {
      DbErrorHandler(err, history, 'Unable to fetch leaderboard');
    }
  };

  const getCaseStudy = async () => {
    const urlCaseStudy = '/api/case-studies/featured';
    try {
      const res = await axios.get(urlCaseStudy);
      if (res.data !== null) setCaseStudy(res.data);
    } catch (err) {
      DbErrorHandler(err, history, 'Unable to fetch case study');
    }
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
