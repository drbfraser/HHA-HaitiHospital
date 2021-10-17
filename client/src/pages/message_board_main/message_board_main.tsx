import * as React from "react";
// import { Link } from "react-router-dom";

import { ElementStyleProps } from 'constants/interfaces';

interface MessageBoardMainProps extends ElementStyleProps {};

export const MessageBoardMain = ( props : MessageBoardMainProps) => {
    return (
        <div className={'message-board-main '+props.classes}>
            <div>this is a Case message board page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};