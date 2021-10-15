import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import NavBar from "components/Navbar/Navbar";

import ElementStyleProps from "components/IProps/IProps";

import "./styles.css";

interface ICaseStudyMain extends ElementStyleProps {

};

interface ICaseStudyMain extends RouteComponentProps {};

export const CaseStudyMain = ({history, location, match}: ICaseStudyMain) => {
    // const postId = 5;
    return (
        <div>
            <NavBar />
            <p> Previous Case Studies</p>

            <div className="case-study-main-content">
                <button className="caseTwo-button"onClick={() => {
                    history.push("/");
                }}></button>
                <button className="caseOne-button"onClick={() => {
                    history.push("/");
                }}></button>
                <button className="case-study-more-button"onClick={() => {
                    history.push("/");
                }}></button>
            </div>
        </div>

    );
};