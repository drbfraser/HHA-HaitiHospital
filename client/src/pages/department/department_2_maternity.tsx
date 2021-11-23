import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import './department_2_maternity.css'

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};


export const DepartmentTwo = (props : DepartmentProps) => {
    return (
        <div className={'department-two ' + props.classes}>
            <SideBar/>
            <main className="container-fluid main-region">
                <Header/>

                {/*<Link className="submit_data_button" to={"/NICUForm"} >Submit Data</Link>*/}

                {/*<button className="GOTOSUMMARYPLZ"*/}
                {/*        onClick={() => {*/}
                {/*            props.history.push("/Department1NICU/summary_reports");*/}
                {/*        }}>Report Summary*/}
                {/*</button>*/}

            </main>

        </div>
    );
};