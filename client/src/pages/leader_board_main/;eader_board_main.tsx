import * as React from "react";
// import { Link } from "react-router-dom";

import { ElementStyleProps } from 'constants/interfaces';

interface LeaderBoardMainProps extends ElementStyleProps {};

export const LeaderBoardMain = ( props :LeaderBoardMainProps) => {
    return (
        <div className={'leader-board-main '+props.classes}>
            <div>this is a Case leader board page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};