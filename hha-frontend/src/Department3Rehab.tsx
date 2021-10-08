import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
require("./DepartmentPageDeptButtons.css");

interface Props extends RouteComponentProps{}

export const DepartmentThree: React.FC<Props> = ({history}) => {
    // const postId = 5;
    return (
        <div>
            <button className="Departmentbutton0"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("../");
                }}></button>
            <div>
                    <>
                    <h1 style={{color:"black",backgroundColor: "lightblue", fontFamily:'sans-serif'}}>Department of Rehab</h1>
                    </>
                        
            </div>
            <div>
            <button className="Departmentbutton1"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/Department1NICU");
                }}>NICU / PAED</button>
            <button className="Departmentbutton2"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/Department2Maternity");
                }}>MATERNITY</button>
            </div>
            <button className="Departmentbutton3"
                >REHAB</button>
            <button className="Departmentbutton4"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/Department4ComHealth");
                }}>COM-HEALTH</button>
        </div>
    );
};