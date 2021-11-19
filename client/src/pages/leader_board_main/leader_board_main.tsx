import { useState, useEffect } from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';
import './leader_board_main.css'
import EOM from '../../img/case1.jpg'
import axios from 'axios'

interface LeaderBoardMainProps extends ElementStyleProps {};

export const LeaderBoardMain = ( props :LeaderBoardMainProps) => {
    const [leaderboard, setLeaderboard] = useState([]);
    const urlLeaderboard = '/api/leaderboard';
    const getLeaderboard = async () => {
        try {
            const res = await axios.get(urlLeaderboard);
            setLeaderboard(res.data);
            console.log(leaderboard);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLeaderboard();
    }, [leaderboard.length]);

    return (
        <div className={'leader-board-main '+(props.classes||'')}>
            <SideBar/>

            <main className="container-fluid">
                <Header/>

                <div className="my-3 p-2 bg-body rounded shadow-sm">
                    <h5 className="mb-3">Department Leaderboard</h5>
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col" style={{width: '5%'}} className="text-center">Position</th>
                                    <th scope="col" style={{width: '10%'}} className="text-center"></th>
                                    <th scope="col" className="text-center">Department</th>
                                    {/* <th scope="col" style={{width: '5%'}} className="d-none d-sm-table-cell">Forms</th> */}
                                    <th scope="col" style={{width: '15%'}} className="d-none d-sm-table-cell text-center">Case Studies</th>
                                    <th scope="col" className="text-center">Points</th>
                                </tr>
                            </thead>
                            <tbody>
                                {leaderboard.map((item, index) => (
                                <tr key={item._id} className={`${index === 0 ? "table-warning": ""}`}>
                                    <th scope="row" className="text-center">{index + 1}</th>
                                    <td className="text-center">
                                        {index === 0 ? <i className="text-warning bi-trophy-fill"/> : null}
                                        {index === 1 ? <i className="text-secondary bi-trophy-fill"/> : null}
                                        {index === 2 ? <i className="text-danger bi-trophy-fill"/> : null}
                                    </td>
                                    <td className="text-center">{item.name}</td>
                                    {/* <td className="d-none d-sm-table-cell">0</td> */}
                                    <td className="d-none d-sm-table-cell text-center">{item.nCaseStudies}</td>
                                    <td className="fw-bold text-center">{item.points}</td>
                                </tr>
                                ))}
                            </tbody>
                        </table>
                    {/* <div className="d-block text-end mt-1">
                        <div className="d-flex pb-1 mb-0 row">
                            <i className="text-warning mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>
                            <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">Department</h6>
                            <h6 className="text-warning col-3 col-sm-3 col-md-2 col-lg-2">NICU/PAED</h6>
                            <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">position</h6>
                            <h6 className="text-warning px-4 col-1 col-sm-1 col-md-1 col-lg-1">1</h6>
                            <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">score</h6>
                            <h6 className="text-warning col-1 col-sm-1 col-md-1 col-lg-1">99</h6>
                        </div>

                        <div className="d-flex pb-1 mb-0 row">
                            <i className="text-secondary mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>
                            <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">Department</h6>
                            <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Maternity</h6>
                            <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">position</h6>
                            <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">2</h6>
                            <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">score</h6>
                            <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">89</h6>
                        </div>

                        <div className="d-flex pb-1 mb-0 row">
                            <i className="text-danger mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>
                            <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">Department</h6>
                            <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Rehab</h6>
                            <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">position</h6>
                            <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">3</h6>
                            <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">score</h6>
                            <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">79</h6>
                        </div>

                        <div className="d-flex pb-1 mb-0 row">
                            <i className=" mx-1 col-1 col-sm-1 col-md-1 col-lg-1"/>
                            <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">Department</h6>
                            <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Com&Health</h6>
                            <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">position</h6>
                            <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">4</h6>
                            <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">score</h6>
                            <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">69</h6>
                        </div>
                    </div> */}
                </div>

                <div className="card mb-3">
                    <div className="row no-gutters">

                        <div className="col-md-8">
                            <div className="card-body">
                                <h4 className="card-title pb-4">Employee of month</h4>
                                <p className="card-text">There was once a queen who had no children, and it grieved her sorely. One winter's afternoon she was sitting by the window sewing when she pricked her finger, and three drops of blood fell on the snow. Then she thought to herself:</p>
                                <p className="card-text">"Ah, what would I give to have a daughter with skin as white as snow and cheeks as red as blood."</p>
                                <p className="card-text pb-5">After a while a little daughter came to her with skin as white as snow and cheeks as red as blood. So they called her Snow White.</p>
                                <p className="card-text"><small className="text-muted">Last updated 3 days ago</small>
                                </p>
                            </div>
                        </div>

                        <div className="col-md-4">
                            <div className="EOM_img">
                                <img src={EOM} className="card-img-top p-3 m-2" alt="issa meme"/>
                            </div>
                        </div>

                    </div>
                </div>

            </main>

        </div>
    );
};