import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { ElementStyleProps } from 'constants/interfaces';
import MessagePanel from 'components/message_panel/message_panel'

interface MessageBoardMainProps extends ElementStyleProps {}

function getClassName(classes:string |undefined) {
    if (classes === undefined) {
        return 'message-board-main';
    }
    else {
        return `message-board-main ${classes}`;
    }
}



export const MessageBoardMain = ( props : MessageBoardMainProps) => {

    return (
        <div className={getClassName(props.classes)}>
            <SideBar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
                <Header/>

                <MessagePanel/>

            </main>
        </div>
    );
};