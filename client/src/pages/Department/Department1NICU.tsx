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


export const DepartmentOne = ({history} : IDepartment) => {
    return (
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

            <button className="Departmentbutton1"
                >NICU / PAED</button>
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
    );
};