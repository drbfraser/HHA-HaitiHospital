import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import MessagePanel from 'components/message_panel/message_panel'
import './message_board_main.css'

interface MessageBoardMainProps {}


export const MessageBoardMain = ( props : MessageBoardMainProps) => {

    return (
        <div className={'message-board-main'}>
            <SideBar/>

            <main className='container-fluid main-region'>
                <Header/>

                <MessagePanel/>

            </main>
        </div>
    );
};