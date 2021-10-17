import * as React from "react";
// import { Link } from "react-router-dom";

import { ElementStyleProps } from 'constants/interfaces';

interface ILeaderBoardMain extends ElementStyleProps {};

export const LeaderBoardMain = ( props :ILeaderBoardMain) => {
    return (
        <div>
            <div>this is a Case leader board page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};