import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import NavBar from "components/nav_bar/nav_bar";

import { ElementStyleProps } from "constants/interfaces";

import "./styles.css";
import { isPropertySignature } from "typescript";

interface CaseStudyMainProps extends ElementStyleProps {

};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  // const postId = 5;
  return (
    <div className={'case-study-main '+ props.classes}>
      <NavBar />
      <p> Previous Case Studies</p>

      <div className="case-study-main-content">
        <button className="caseTwo-button"
            onClick={() => {props.history.push("/");}}>
        </button>
        <button className="caseOne-button"
            onClick={() => {props.history.push("/");}}>
        </button>
        <button className="case-study-more-button"
            onClick={() => {props.history.push("/");}}>
        </button>
      </div>
      
    </div>

  );
};