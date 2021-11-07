import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';
// import { useState, useEffect } from 'react';

// import { LeaderProps } from 'constants/interfaces';
// import Axios from 'axios';

interface DashboardLeaderProps extends ElementStyleProps {
    // leader :LeaderProps[],
}

// const fetchLeader = (async () => {
//     let leaders = await Axios.get("/api/leaderboard");
//     return leaders;
// })

const DashboardLeaderOverview = (props : DashboardLeaderProps) => {
    // const [ leader, setLeader ] = useState([]);
    //
    // useEffect(() => {
    //     const leaderFromServer = fetchLeader();
    //     leaderFromServer.then(val => {
    //         setLeader(val.data);
    //     })
    // }, [])

    return(
        <div className={'dashboard-leader-overview '+ (props.classes||'')}>
            {/*option 1: show four departments */}

            {/*<div className="my-3 p-2 bg-body rounded shadow-sm">*/}
            {/*    <h5 className="pb-1 mb-3">Leader Board</h5>*/}

            {/*    <div className="d-flex border-bottom pb-1 mb-0 row">*/}
            {/*        <h6 className="text-secondary col-md-2 text-center">position</h6>*/}
            {/*        <h6 className="text-secondary col-md-3 text-center">score</h6>*/}
            {/*        <h6 className="text-secondary col-auto">Departments</h6>*/}
            {/*    </div>*/}

            {/*    <div className="d-flex text-muted">*/}

            {/*        <div className="mb-0 small lh-sm w-100">*/}
            {/*            <div className="d-flex border-bottom pt-1 row">*/}
            {/*                <h6 className="text-warning col-md-2 text-center">1</h6>*/}
            {/*                <h6 className="text-warning col-md-3 text-center">99</h6>*/}
            {/*                <h6 className="text-warning col">NICU/PAED</h6>*/}
            {/*            </div>*/}

            {/*            <div className="d-flex border-bottom pt-1 row">*/}
            {/*                <h6 className="text-secondary col-md-2 text-center">2</h6>*/}
            {/*                <h6 className="text-secondary col-md-3 text-center">88</h6>*/}
            {/*                <h6 className="text-dark col">MATERNITY</h6>*/}
            {/*            </div>*/}

            {/*            <div className="d-flex border-bottom pt-1 pt-1 row">*/}
            {/*                <h6 className="text-secondary col-md-2 text-center">3</h6>*/}
            {/*                <h6 className="text-secondary col-md-3 text-center">77</h6>*/}
            {/*                <h6 className="text-dark col">REHAB</h6>*/}
            {/*            </div>*/}

            {/*            <div className="d-flex pt-1 row">*/}
            {/*                <h6 className="text-secondary col-md-2 text-center">4</h6>*/}
            {/*                <h6 className="text-secondary col-md-3 text-center">66</h6>*/}
            {/*                <h6 className="text-dark col">COM & HEALTH</h6>*/}
            {/*            </div>*/}
            {/*        </div>*/}
            {/*    </div>*/}


            {/*option 2: show leader only*/}

            <div className="my-3 p-2 bg-body rounded shadow-sm">
                <h5 className="pb-1 mb-3">Department Leader</h5>

                <div className="d-flex pb-1 mb-0 row">
                    <i className="text-warning mx-1 col-md-1 bi bi-trophy-fill"/>
                    <h6 className="text-secondary  col-md-2">Department</h6>
                    <h6 className="text-warning col-md-4">NICU/PAED</h6>
                    <h6 className="text-secondary  col-md-1">position</h6>
                    <h6 className="text-warning px-4 col-md-1">1</h6>
                    <h6 className="text-secondary col-md-1">score</h6>
                    <h6 className="text-warning col-md-1">99</h6>
                </div>

                    {/*// this part is a Placeholder Components for leader overview in the further*/}

                    {/*<div className="pb-3 mb-0 lh-sm w-100">{*/}
                    {/*    (leader.map((leader, index) => {*/}
                    {/*            // option 1:*/}
                    {/*            // Displaying top 4 leaders*/}
                    {/*            if (index <= 3) {*/}
                    {/*                return(*/}
                    {/*                    <tr key={index} className="d-flex mt-3 row border-bottom">*/}
                    {/*                        <td className="text-dark col-md-2">*/}
                    {/*                            {leader.leaderDepartment}*/}
                    {/*                        </td>*/}
                    {/*                        <td className="text-dark col-md-2">*/}
                    {/*                            {leader.leaderPosition}*/}
                    {/*                        </td>*/}
                    {/*                        <td className="text-dark col-md-2">*/}
                    {/*                            {leader.score}*/}
                    {/*                        </td>*/}
                    {/*                    </tr>*/}
                    {/*                )*/}
                    {/*            }*/}
                    {/*        })*/}
                    {/*    )}*/}
                    {/*</div>*/}

            </div>
        </div>
    )
}

export default DashboardLeaderOverview;