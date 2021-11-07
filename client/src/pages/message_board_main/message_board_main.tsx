import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';
import './message_board_main.css'

interface MessageBoardMainProps extends ElementStyleProps {}

export const MessageBoardMain = ( props : MessageBoardMainProps) => {
    return (
        <div className={'message-board-main '+(props.classes||'')}>
            <SideBar/>

            <main className='container'>
                <Header/>
                <h4>this is the message board page</h4>
            </main>
        </div>
    );
};