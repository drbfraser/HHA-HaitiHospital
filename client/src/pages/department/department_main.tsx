import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import NavBar from "components/nav_bar/nav_bar";

import "./department_main_style.css";

interface DepartmentMainProps extends ElementStyleProps {};
interface DepartmentMainProps extends RouteComponentProps{}

export const DepartmentMain = ({history} : DepartmentMainProps) => {
  return (
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
  );
};