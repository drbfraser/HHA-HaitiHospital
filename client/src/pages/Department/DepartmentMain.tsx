import * as React from "react";
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

import IProps from "components/IProps/IProps";
import NavBar from "components/NavBar/NavBar";

import "./DepartmentMainStyle.css";

interface IDepartmentMain extends IProps {};
interface IDepartmentMain extends RouteComponentProps{}

export const DepartmentMain = ({history} : IDepartmentMain) => {
    return (
        <body>
            <div>
                <NavBar />
                <p>All Departments</p>
                <div className="allDepartemnts">
                    <button className="DepartmentButton1"
                            onClick={() => {
                                history.push("/Department1NICU");
                            }}>NICU / PAED</button>
                    <button className="DepartmentButton2"
                            onClick={() => {
                                history.push("/Department2Maternity");
                            }}>MATERNITY</button>
                    <button className="DepartmentButton3"onClick={() => {
                        history.push("/Department3Rehab");
                    }}>REHAB</button>
                    <button className="DepartmentButton4"onClick={() => {
                        history.push("/Department4ComHealth");
                    }}>COM-HEALTH</button>

                    <button className="DepartmentButton5">Other</button>
                    <button className="DepartmentButton6">Other</button>
                    <button className="DepartmentButton7">Other</button>
                    <button className="DepartmentButton8">Other</button>
                </div>
            </div>
        </body>
    );
};