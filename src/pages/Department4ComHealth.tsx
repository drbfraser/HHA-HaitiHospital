import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
// import Navbar from "./Components/Navbar/Navbar";
require("./DepartmentPageDeptButtons.css");

interface Props extends RouteComponentProps{}

export const DepartmentFour: React.FC<Props> = ({history}) => {
    // const postId = 5;
    return (
        <div>
            {/* <Navbar /> */}
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