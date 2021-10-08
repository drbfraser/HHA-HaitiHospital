import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import case1 from "./img/case1.jpg"
import case2 from "./img/case2.jpg"
require("./HomeStyle.css");

interface Props extends RouteComponentProps {}

export const Home: React.FC<Props> = ({ history, location, match }) => {
    console.log(match, location);
    return (
        <div className="depart">
            <div>This is the second half of the home page</div>
            {/*<Link to="/department">toDepart</Link>*/}
            <button className="button1"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/Department1NICU");
                }}>NICU / PAED</button>
            <button className="button2"
                    onClick={() => {
                        history.push("/Department2Maternity");
                    }}>MATERNITY</button>
            <button className="button3"onClick={() => {
                        history.push("/Department3Rehab");
                    }}>REHAB</button>
            <button className="button4"onClick={() => {
                        history.push("/Department4ComHealth");
                    }}>COM-HEALTH</button>
            <button className="button5">MORE</button>

            <div>
                <button className="caseStudyButton"
                onClick={() => {
                    history.push("./caseStudyMain");
                }}>Case Study</button>
            </div>
            <div className="caseStudy-image">
                <img src={case1} className="caseOne" alt="case1"/>
                <img src={case2} className="caseTwo" alt="case2" />
            </div>
        </div>
    );

};
