import * as React from "react";
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

import IProps from "components/IProps/IProps";
import NavBar from "components/NavBar/NavBar";

import Logo from "img/logo/LogoWText.svg";
import "./DepartmentPageDeptButton.css";

interface IDepartment extends IProps {

};

interface IDepartment extends RouteComponentProps {

};

export const DepartmentFour = ({history} : IDepartment) => {
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