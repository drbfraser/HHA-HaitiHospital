import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

import { ElementStyleProps } from "constants/interfaces";
import Header from "components/header/header";
import DepartmentReports from 'components/department_reports/department_reports';
import "./department_style.css"

interface DeparmentProps extends ElementStyleProps {

};

interface DeparmentProps extends RouteComponentProps {

};


export const DepartmentOne = (props : DeparmentProps) => {
  return (
    <div className={'department-one '+ props.classes}>
      <Header />
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


    </div>
  );
};