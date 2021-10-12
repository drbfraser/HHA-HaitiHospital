import * as React from "react";
// import { Link } from "react-router-dom";

import IProps from 'components/IProps/IProps';

interface IMessageBoardMain extends IProps {};

export const MessageBoardMain = ({}:IProps) => {
    return (
        <div>
            <div>this is a Case message board page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};