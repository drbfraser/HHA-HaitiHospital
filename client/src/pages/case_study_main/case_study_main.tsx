import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import NavBar from "components/nav_bar/nav_bar";

import { ElementStyleProps } from "constants/interfaces";

import "./styles.css";

interface CaseStudyMainProps extends ElementStyleProps {

};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = ({history, location, match}: CaseStudyMainProps) => {
  // const postId = 5;
  return (
    <div>
      <NavBar />
      <p> Previous Case Studies</p>

      <div className="case-study-main-content">
        <button className="caseTwo-button"
            onClick={() => {history.push("/");}}>
        </button>
        <button className="caseOne-button"
            onClick={() => {history.push("/");}}>
        </button>
        <button className="case-study-more-button"
            onClick={() => {history.push("/");}}>
        </button>
      </div>
      
    </div>

  );
};