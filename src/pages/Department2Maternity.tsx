import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
require("./DepartmentPageDeptButtons.css");

interface Props extends RouteComponentProps{}

export const DepartmentTwo: React.FC<Props> = ({history}) => {
    // const postId = 5;
    return (
        <div>
            <Navbar />
                {/* <button className="Departmentbutton0"
                onClick={() => {
                    history.push("../");
                }}></button> */}
            <div>
                    <>
                    <h1 style={{color:"white",backgroundColor: "#87EDF3", fontFamily:'sans-serif'}}>Department of Maternity</h1>
                    </>     
            </div>            
            <button className="Departmentbutton1"
                onClick={() => {
                    history.push("/Department1NICU");
                }}>NICU / PAED</button>
            <button className="Departmentbutton2"
                >MATERNITY</button>
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