import * as React from "react";
import { Link, NavLink, RouteComponentProps } from "react-router-dom";
import Logo from "./img/logo.png";
import Navbar from "../components/Navbar/Navbar";
require("../style/departmentStyle.css");

interface Props extends RouteComponentProps{}



export const DepartmentOne: React.FC<Props> = ({history}) => {
    return (
        <body>
        <div>
            <Navbar />
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
        </body>

    );
};