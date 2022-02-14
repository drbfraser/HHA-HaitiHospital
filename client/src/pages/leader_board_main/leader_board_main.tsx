import { useState, useEffect } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import './leader_board_main.css';
import EOM from '../../img/case1.jpg';
import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DbErrorHandler from 'actions/http_error_handler';
import { useHistory } from 'react-router';

interface LeaderBoardMainProps {}

export const LeaderBoardMain = (props: LeaderBoardMainProps) => {
  const [leaderboard, setLeaderboard] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const urlLeaderboard = '/api/leaderboard';

    const getLeaderboard = async () => {
      try {
        const res = await axios.get(urlLeaderboard);
        setLeaderboard(res.data);
      } catch (err) {
        DbErrorHandler(err, history);
      }
    };
    getLeaderboard();
  }, [history]);

  const { t } = useTranslation();

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

        <div className="card mb-3">
          <div className="row no-gutters">
            <div className="col-md-8">
              <div className="card-body">
                <h4 className="card-title pb-4">{t('leaderBoardEmployeeOfMonth')}</h4>
                <p className="card-text">
                  There was once a queen who had no children, and it grieved her sorely. One
                  winter's afternoon she was sitting by the window sewing when she pricked her
                  finger, and three drops of blood fell on the snow. Then she thought to herself:
                </p>
                <p className="card-text">
                  "Ah, what would I give to have a daughter with skin as white as snow and cheeks as
                  red as blood."
                </p>
                <p className="card-text pb-5">
                  After a while a little daughter came to her with skin as white as snow and cheeks
                  as red as blood. So they called her Snow White.
                </p>
                <p className="card-text">
                  <small className="text-muted">{t('leaderBoardLastUpdate')}</small>
                </p>
              </div>
            </div>

            <div className="col-md-4">
              <div className="EOM_img">
                <img src={EOM} className="card-img-top p-3 m-2" alt="issa meme" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
