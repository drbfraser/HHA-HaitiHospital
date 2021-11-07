import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';
import './leader_board_main.css'
// import { Link } from "react-router-dom";

interface LeaderBoardMainProps extends ElementStyleProps {};

export const LeaderBoardMain = ( props :LeaderBoardMainProps) => {
    return (
        <div className={'leader-board-main '+(props.classes||'')}>
            <SideBar/>

            <main className="container">
                <Header/>
                <div>this is the leader board page</div>
            </main>

        </div>
    );
};