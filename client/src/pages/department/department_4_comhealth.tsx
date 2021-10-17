import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import NavBar from "components/nav_bar/nav_bar";

// import Logo from "img/logo/LogoWText.svg";
// import "./DepartmentPageDeptButtons.css";
import "./department_style.css"

interface DepartmentProps extends ElementStyleProps {

};

interface DepartmentProps extends RouteComponentProps {

};

export const DepartmentFour = ({history} : DepartmentProps) => {
    // const postId = 5;
  return (
    <div>
        <NavBar />
        {/* <button className="Departmentbutton0"
            onClick={() => {
                history.push("../");
            }}></button> */}
        <div>
            <>
                <h1 style={{color:"white",backgroundColor: '#87EDF3', fontFamily:'sans-serif'}}>Department of Community Health</h1>
            </>
        </div>

        <button className="Departmentbutton1"
                onClick={() => {
                    history.push("/Department1NICU");
                }}>NICU / PAED</button>
        <button className="Departmentbutton2"
                onClick={() => {
                    history.push("/Department2Maternity");
                }}>MATERNITY</button>
        <button className="Departmentbutton3"
                onClick={() => {
                    history.push("/Department3Rehab");
                }}>REHAB</button>
        <button className="Departmentbutton4"
        >COM-HEALTH</button>
    </div>
  );
};