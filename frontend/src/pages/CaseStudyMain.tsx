import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";

require("../style/CaseStudyMainStyle.css");

interface Props extends RouteComponentProps {}

export const CaseStudyMain: React.FC<Props> = ({ history, location, match }) => {
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