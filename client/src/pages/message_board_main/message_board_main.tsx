import * as React from "react";
import SideBar from 'components/side_bar/side_bar';
import { ElementStyleProps } from 'constants/interfaces';

interface MessageBoardMainProps extends ElementStyleProps {};

export const MessageBoardMain = ( props : MessageBoardMainProps) => {
    return (
        <div className={'message-board-main '+(props.classes||'')}>
            <SideBar/>
            <h1>this is a Case message board page</h1>
        </div>
    );
};