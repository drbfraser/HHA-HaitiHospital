import * as React from "react";
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

import IProps from "components/IProps/IProps";
import NavBar from "components/NavBar/NavBar";

import Logo from "img/logo/LogoWText.svg";
import "pages/Department/DepartmentPageDeptButton.css";

interface IDepartment extends IProps {

};

interface IDepartment extends RouteComponentProps {

};

export const DepartmentThree = ({history} : IDepartment) => {
    // const postId = 5;
    return (
        <div>
            {/* <NavBar /> */}
            {/* <button className="Departmentbutton0"
                onClick={() => {
                    history.push("../");
                }}></button> */}
            <div>
                    <>
                        <h1 style={{color:"white",backgroundColor: '#87EDF3', fontFamily:'sans-serif'}}>Department of Rehab</h1>
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
                >REHAB</button>
            <button className="Departmentbutton4"
                onClick={() => {
                    history.push("/Department4ComHealth");
                }}>COM-HEALTH</button>

        </div>
    );
};