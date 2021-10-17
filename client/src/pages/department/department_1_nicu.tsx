import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";

import NavBar from "components/nav_bar/nav_bar";

// import Logo from "img/logo/LogoWText.svg";
// import "./DepartmentPageDeptButtons.css";
import "./department_style.css"

interface DeparmentProps extends ElementStyleProps {

};

interface DeparmentProps extends RouteComponentProps {

};


export const DepartmentOne = ({history} : DeparmentProps) => {
  return (
    <div>
      <div>
        <NavBar />
          {/* <button className="homePageButton"
              onClick={() => {
                history.push("../");
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
                history.push("/Department2Maternity");
            }}>MATERNITY</button>
        <button className="Departmentbutton3"
            onClick={() => {
                history.push("/Department3Rehab");
            }}>REHAB</button>
        <button className="Departmentbutton4"
            onClick={() => {
                history.push("/Department4ComHealth");
            }}>COM-HEALTH</button>
      </div>

      <div>
        <button className="GOTOSUMMARYPLZ"
            onClick={() => {
                history.push("/Department1NICU/summary_reports");
            }}>Report Summary
        </button>
      </div>
    </div>
  );
};