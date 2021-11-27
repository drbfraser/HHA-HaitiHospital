import * as React from "react";
import { Link, RouteComponentProps, useParams } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from "components/header/header";
import DepartmentReports from 'components/department_reports/department_reports';
import {useTranslation} from "react-i18next";
import {DepartmentName} from 'constants/interfaces'
import './department_style.css'

interface DepartmentProps {
}

export const Department = (props : DepartmentProps) => {
    const {t, i18n} = useTranslation();
    const name = useParams<{name:string}>();


  return (
    <div className='department'>
        <SideBar/>
        <main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                {/* Department Title */ }
                <section>
                    <h1 className='text-start'>{`Department of ${props.name}`}</h1>
                </section>

                {/* Nav buttons */}
                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-sm-6 col-md-6 col-lg-6'>
                            <Link to={"/NICUForm"}>
                                <button className=" btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">{t("departmentPageSubmitDate")}</div>
                                </button>
                            </Link>
                        </div>

                        <div className='col-sm-6 col-md-6 col-lg-6'>
                            <Link to={"#"}>
                                <button className="btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">{t("departmentPageBiomechanic")}</div>
                                </button>
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Department Report Summary */}
                <section>
                    {/* <DepartmentReports department={"NICU/PAED"}/> */}
                    <DepartmentReports department={props.name}/>
                </section>
            </div>
        </main>

    </div>
  );
};