import * as React from "react";
import { Link } from "react-router-dom";

import IProps from "components/IProps/IProps";

import "pages/CaseStudyMain/styles.css";

interface ICaseStudyMain extends IProps {

};

export const CaseStudyMain = (props: ICaseStudyMain) => {
    // const postId = 5;
    return (
        <div>
            <div>this is a Case Study main page</div>
            {/*<Link to={`/posts/${postId}`}>go to post 1</Link>*/}
        </div>
    );
};