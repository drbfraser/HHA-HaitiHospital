import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';

interface MessageBoardMainProps extends ElementStyleProps {}

export const MessageBoardMain = ( props : MessageBoardMainProps) => {
    return (
        <div className={'message-board-main '+(props.classes||'')}>
            <SideBar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Header/>
                <h1>this is a Case message board page</h1>
            </main>
        </div>
    );
};