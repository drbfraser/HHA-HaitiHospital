import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

<<<<<<< HEAD:client/src/pages/CaseStudyMain/CaseStudyMain.tsx
import IProps from "components/IProps/IProps";

import "./styles.css";

interface ICaseStudyMain extends IProps {

};

export const CaseStudyMain = (props: ICaseStudyMain) => {
    // const postId = 5;
=======
require("../style/CaseStudyMainStyle.css");

interface Props extends RouteComponentProps {}

export const CaseStudyMain: React.FC<Props> = ({ history, location, match }) => {
>>>>>>> 8d9f73d2a79f93bfc40b54db3967b8bc7a38af59:frontend/src/pages/CaseStudyMain.tsx
    return (
        <body>
            <Navbar />
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
        </body>

    );
};