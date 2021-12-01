import React, { useState, useEffect } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
// import { useState, useEffect } from 'react';
// import { LeaderProps } from 'constants/interfaces';
import axios from 'axios';
import Collapsible from "../collapsible/collapsible";
import {useTranslation} from "react-i18next";
import { Link } from 'react-router-dom';

interface DashboardLeaderProps extends ElementStyleProps {

}

const DashboardLeaderOverview = (props : DashboardLeaderProps) => {

    const [leaderboard, setLeaderboard] = useState([]);
    const urlLeaderboard = '/api/leaderboard';
    const getLeaderboard = async () => {
        try {
            const res = await axios.get(urlLeaderboard);
            setLeaderboard(res.data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getLeaderboard();
    }, []);

    const {t, i18n} = useTranslation();

    return(
        <div className={'dashboard-leader-overview '+ (props.classes||'')}>
            <div className="my-3 p-2 bg-body rounded shadow-sm">
                <h5 className="mb-3">{t("leaderBoardOverviewDepartmentLeader")}</h5>
                <div className="table-responsive">
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col" style={{width: '5%'}} className="text-center">{t("leaderBoardOverviewPosition")}</th>
                                <th scope="col" style={{width: '10%'}} className="text-center"></th>
                                <th scope="col" className="text-center">{t("leaderBoardOverviewDepartment")}</th>
                                {/* <th scope="col" style={{width: '5%'}} className="d-none d-sm-table-cell">Forms</th> */}
                                <th scope="col" style={{width: '15%'}} className="d-none d-sm-table-cell text-center">{t("leaderBoardOverviewCaseStudies")}</th>
                                <th scope="col" className="text-center">{t("leaderBoardOverviewPoints")}</th>
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
                            ))
                            }
                        </tbody>
                    </table>
                </div>
                <div className="d-flex justify-content-end">
                    <Link to="leaderBoard"><button type="button" className="btn btn-warning btn-block col-auto">{t("leaderBoardOverviewSeeFullLeaderboard")}</button></Link>
                </div>
            </div>

            {/*option 2: show leader only but could show top four by collapsible*/}

            {/*<div className="my-3 p-2 bg-body rounded shadow-sm">*/}
            {/*    <h5 className="pb-2 mb-3">{t("leaderBoardOverviewDepartmentLeader")}</h5>*/}

            {/*    <div className="d-block text-end mt-1">*/}
            {/*        <div className="d-flex pb-1 mb-0 row">*/}
            {/*            <i className="text-warning mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>*/}
            {/*            <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">{t("leaderBoardOverviewDepartment")}</h6>*/}
            {/*            <h6 className="text-warning col-3 col-sm-3 col-md-2 col-lg-2">NICU/PAED</h6>*/}
            {/*            <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">{t("leaderBoardOverviewPosition")}</h6>*/}
            {/*            <h6 className="text-warning px-4 col-1 col-sm-1 col-md-1 col-lg-1">1</h6>*/}
            {/*            <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">{t("leaderBoardOverviewScore")}</h6>*/}
            {/*            <h6 className="text-warning col-1 col-sm-1 col-md-1 col-lg-1">99</h6>*/}
            {/*        </div>*/}

            {/*        <Collapsible label="See top four">*/}
            {/*            <div className="d-flex pb-1 mb-0 row">*/}
            {/*                <i className="text-secondary mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>*/}
            {/*                <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">{t("leaderBoardOverviewDepartment")}</h6>*/}
            {/*                <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Maternity</h6>*/}
            {/*                <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">{t("leaderBoardOverviewPosition")}</h6>*/}
            {/*                <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">2</h6>*/}
            {/*                <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">{t("leaderBoardOverviewScore")}</h6>*/}
            {/*                <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">89</h6>*/}
            {/*            </div>*/}
            {/*            <div className="d-flex pb-1 mb-0 row">*/}
            {/*                <i className="text-danger mx-1 col-1 col-sm-1 col-md-1 col-lg-1 bi bi-trophy-fill"/>*/}
            {/*                <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">{t("leaderBoardOverviewDepartment")}</h6>*/}
            {/*                <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Rehab</h6>*/}
            {/*                <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">{t("leaderBoardOverviewPosition")}</h6>*/}
            {/*                <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">3</h6>*/}
            {/*                <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">{t("leaderBoardOverviewScore")}</h6>*/}
            {/*                <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">79</h6>*/}
            {/*            </div>*/}
            {/*            <div className="d-flex pb-1 mb-0 row">*/}
            {/*                <i className=" mx-1 col-1 col-sm-1 col-md-1 col-lg-1"/>*/}
            {/*                <h6 className="text-secondary col-3 col-sm-3 col-md-2 col-lg-2">{t("leaderBoardOverviewDepartment")}</h6>*/}
            {/*                <h6 className="text-info col-3 col-sm-3 col-md-2 col-lg-2">Com&Health</h6>*/}
            {/*                <h6 className="text-secondary col-2 col-sm-2 col-md-3 col-lg-3">{t("leaderBoardOverviewPosition")}</h6>*/}
            {/*                <h6 className="text-info px-4 col-1 col-sm-1 col-md-1 col-lg-1">4</h6>*/}
            {/*                <h6 className="text-secondary col-1 col-sm-1 col-md-1 col-lg-1">{t("leaderBoardOverviewScore")}</h6>*/}
            {/*                <h6 className="text-info col-1 col-sm-1 col-md-1 col-lg-1">69</h6>*/}
            {/*            </div>*/}
            {/*        </Collapsible>*/}
            {/*    </div>*/}


        </div>
    )
}

export default DashboardLeaderOverview;
