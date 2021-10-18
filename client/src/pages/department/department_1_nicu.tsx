import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import Header from "components/header/header";
// import NavBar from "components/nav_bar/nav_bar";

// import Logo from "img/logo/LogoWText.svg";
import "./department_style.css"

interface DeparmentProps extends ElementStyleProps {

};

interface DeparmentProps extends RouteComponentProps {

};


export const DepartmentOne = (props : DeparmentProps) => {
  return (
    <div className={'department-one '+ props.classes}>
      <Header />
        {/* <button className="homePageButton"
            onClick={() => {
              props.history.push("../");
            }}></button> */}
      <div>
        <>
          <h1 style={{color:"white",backgroundColor: '#87EDF3', fontFamily:'sans-serif'}}>Department of NICU/PAED</h1>
        </>
      </div>
      
      <Link to={"/NICUForm"} >Submit Data</Link>

      <button className="Departmentbutton1">NICU / PAED</button>
      <button className="Departmentbutton2"
          onClick={() => {
              props.history.push("/Department2Maternity");
          }}>MATERNITY</button>
      <button className="Departmentbutton3"
          onClick={() => {
              props.history.push("/Department3Rehab");
          }}>REHAB</button>
      <button className="Departmentbutton4"
          onClick={() => {
              props.history.push("/Department4ComHealth");
          }}>COM-HEALTH</button>

      <button className="GOTOSUMMARYPLZ"
          onClick={() => {
              props.history.push("/Department1NICU/summary_reports");
          }}>Report Summary
      </button>
    </div>
  );
};