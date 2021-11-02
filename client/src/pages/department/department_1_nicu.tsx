import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from "components/header/header";
import DepartmentReports from 'components/department_reports/department_reports';
import "./department_style.css"

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};


export const DepartmentOne = (props : DepartmentProps) => {
  return (
    <div className={'department-one '+ props.classes}>
        <SideBar/>
        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>
            <div className="container mt-3">

                {/* Department Title */ }
                <section>
                    <h1 className='text-start'>Department of NICU/PAED</h1>
                </section>

                {/* Nav buttons */}
                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-sm-3'>
                            <Link to={"/NICUForm"}>
                                <button className=" btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">Submit Data</div>
                                </button>
                            </Link>
                        </div>

                        <div className='col-sm-3'>
                            <Link to={"#"}>
                                <button className="btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">Biomechanic</div>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Department Report Summary */}
                <section>
                    <DepartmentReports department={"NICU/PAED"}/>
                </section>
            </div>
        </main>

    </div>
  );
};