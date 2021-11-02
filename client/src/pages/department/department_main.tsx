import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import Header from "components/header/header";

import "./department_main_style.css";

interface DepartmentMainProps extends ElementStyleProps {}
interface DepartmentMainProps extends RouteComponentProps{}

export const DepartmentMain = (props : DepartmentMainProps) => {
  return (
    <div className={'department-main '+ (props.classes || '')}>
      <Header/>
      <p>All Departments</p>
      <div className="allDepartemnts">
        <button className="DepartmentButton1"
                onClick={() => {
                    props.history.push("/Department1NICU");
                }}>NICU / PAED</button>
        <button className="DepartmentButton2"
                onClick={() => {
                    props.history.push("/Department2Maternity");
                }}>MATERNITY</button>
        <button className="DepartmentButton3" onClick={() => {
            props.history.push("/Department3Rehab");
        }}>REHAB</button>
        <button className="DepartmentButton4" onClick={() => {
            props.history.push("/Department4ComHealth");
        }}>COM-HEALTH</button>
      </div>
    </div>
  );
};