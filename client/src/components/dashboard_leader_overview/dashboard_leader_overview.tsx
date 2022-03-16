import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Api from 'actions/Api';
import { ENDPOINT_LEADERBOARD_GET } from 'constants/endpoints';
import { TOAST_LEADERBOARD_GET } from 'constants/toast_messages';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { History } from 'history';

interface DashboardLeaderProps {}

const DashboardLeaderOverview = (props: DashboardLeaderProps) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const history: History = useHistory<History>();

  const getLeaderboard = async () => {
    setLeaderboard(await Api.Get(ENDPOINT_LEADERBOARD_GET, TOAST_LEADERBOARD_GET, history));
  };

  useEffect(() => {
    getLeaderboard();
  }, []);

  const { t } = useTranslation();

  return (
    <div className={'dashboard-leader-overview'}>
      <div className="my-3 p-2 bg-body rounded shadow-sm">
        <h5 className="mb-3">{t('leaderBoardOverviewDepartmentLeader')}</h5>
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col" style={{ width: '5%' }} className="text-center">
                  {t('leaderBoardOverviewPosition')}
                </th>
                <th scope="col" style={{ width: '10%' }} className="text-center"></th>
                <th scope="col" className="text-center">
                  {t('leaderBoardOverviewDepartment')}
                </th>
                <th
                  scope="col"
                  style={{ width: '15%' }}
                  className="d-none d-sm-table-cell text-center"
                >
                  {t('leaderBoardOverviewCaseStudies')}
                </th>
                <th scope="col" className="text-center">
                  {t('leaderBoardOverviewPoints')}
                </th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item, index) => {
                return (
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
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="d-flex justify-content-end">
          <Link to="leaderBoard">
            <button type="button" className="btn btn-warning btn-block col-auto">
              {t('leaderBoardOverviewSeeFullLeaderboard')}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardLeaderOverview;
