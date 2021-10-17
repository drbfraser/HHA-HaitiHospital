import * as React from "react";
// import { Link } from "react-router-dom";

import { ElementStyleProps } from 'constants/interfaces';

interface IMessageBoardMain extends ElementStyleProps {};

export const MessageBoardMain = ( props : IMessageBoardMain) => {
    return (
        <div>
            <div>this is a Case message board page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};