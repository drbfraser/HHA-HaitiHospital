import * as React from "react";
import { RouteComponentProps} from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'

// import "./case_study_main_styles.css";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  return (
    <div className={'case-study-main '+ props.classes}>
        <SideBar/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>

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

        </main>

    </div>
  );
};