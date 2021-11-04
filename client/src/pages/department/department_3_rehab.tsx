import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};


export const DepartmentThree = (props : DepartmentProps) => {
    return (
        <div className={'department-three' + props.classes}>
            <SideBar/>
            <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
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