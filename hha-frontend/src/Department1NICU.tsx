import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Logo from "./img/logo.png";
require("./DepartmentPageDeptButtons.css");

interface Props extends RouteComponentProps{}



export const DepartmentOne: React.FC<Props> = ({history}) => {
    return (
        <div>
            {/* <button className="Departmentbutton0"
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