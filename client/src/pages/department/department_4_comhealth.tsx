import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import './department_4_comhealth.css'

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};


export const DepartmentFour = (props : DepartmentProps) => {
    return (
        <div className={'department-four ' + props.classes}>
            <SideBar/>
            <main className="container-fluid main-region">
                <Header/>

                {/*<h1 style={{color:"white",backgroundColor: '#87EDF3', fontFamily:'sans-serif'}}>Department of NICU/PAED</h1>*/}

                {/*<Link className="submit_data_button" to={"/NICUForm"} >Submit Data</Link>*/}

                {/*<button className="GOTOSUMMARYPLZ"*/}
                {/*        onClick={() => {*/}
                {/*            props.history.push("/Department1NICU/summary_reports");*/}
                {/*        }}>Report Summary*/}
                {/*</button>*/}


                {/*<button className="Departmentbutton1">NICU / PAED</button>*/}
                {/*<button className="Departmentbutton2"*/}
                {/*        onClick={() => {*/}
                {/*            props.history.push("/Department2Maternity");*/}
                {/*        }}>MATERNITY</button>*/}
                {/*<button className="Departmentbutton3"*/}
                {/*        onClick={() => {*/}
                {/*            props.history.push("/Department3Rehab");*/}
                {/*        }}>REHAB</button>*/}
                {/*<button className="Departmentbutton4"*/}
                {/*        onClick={() => {*/}
                {/*            props.history.push("/Department4ComHealth");*/}
                {/*        }}>COM-HEALTH</button>*/}
            </main>

        </div>
    );
};