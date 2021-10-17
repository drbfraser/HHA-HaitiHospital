import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import NavBar from "components/nav_bar/nav_bar";

// import Logo from "img/logo/LogoWText.svg";
import "./department_style.css"

interface DepartmentProps extends ElementStyleProps {

};

interface DepartmentProps extends RouteComponentProps {

};

export const DepartmentFour = (props: DepartmentProps) => {
    // const postId = 5;
  return (
    <div className={'department ' + props.classes}>
        <NavBar />
        {/* <button className="Departmentbutton0"
            onClick={() => {
                props.history.push("../");
            }}></button> */}
        <div>
            <>
                <h1 style={{color:"white",backgroundColor: '#87EDF3', fontFamily:'sans-serif'}}>Department of Community Health</h1>
            </>
        </div>

        <button className="Departmentbutton1"
                onClick={() => {
                    props.history.push("/Department1NICU");
                }}>NICU / PAED</button>
        <button className="Departmentbutton2"
                onClick={() => {
                    props.history.push("/Department2Maternity");
                }}>MATERNITY</button>
        <button className="Departmentbutton3"
                onClick={() => {
                    props.history.push("/Department3Rehab");
                }}>REHAB</button>
        <button className="Departmentbutton4"
        >COM-HEALTH</button>
    </div>
  );
};