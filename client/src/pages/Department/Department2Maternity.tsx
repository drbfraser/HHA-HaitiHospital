import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import IProps from "components/IProps/IProps";
import NavBar from "components/Navbar/Navbar";

// import Logo from "img/logo/LogoWText.svg";
// import "./DepartmentPageDeptButtons.css";
import "./departmentStyle.css";

interface IDepartment extends IProps {

};

interface IDepartment extends RouteComponentProps {

};

export const DepartmentTwo = ({history} : IDepartment) => {
    // const postId = 5;
    return (
        <body>
            <div>
                <NavBar />
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
        </body>
    );
};