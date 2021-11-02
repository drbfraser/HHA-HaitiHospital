import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';
// import { Link } from "react-router-dom";

interface LeaderBoardMainProps extends ElementStyleProps {};

export const LeaderBoardMain = ( props :LeaderBoardMainProps) => {
    return (
        <div className={'leader-board-main '+(props.classes||'')}>
            <SideBar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Header/>
                <div>this is a Case leader board page</div>
            </main>

        </div>
    );
};