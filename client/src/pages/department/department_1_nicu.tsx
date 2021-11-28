import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from "components/header/header";
import DepartmentReports from 'components/department_reports/department_reports';
import './department_1_nicu.css'
import {useTranslation} from "react-i18next";

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};

function getClassName(className: string|undefined) {
    if (className === undefined) {
        return "department-one";
    }
    else {
        return `department-one ${className}`
    }
}

export const DepartmentOne = (props : DepartmentProps) => {
    const {t, i18n} = useTranslation();

  return (
    <div className={getClassName(props.classes)}>
        <SideBar/>
        <main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                {/* Department Title */ }
                <section>
                    <h1 className='text-start'>{t("departmentPageNICU/PAED")}</h1>
                </section>

                {/* Nav buttons */}
                <section>
                    <div className="row">

                        <div className='col-auto'>
                            <Link to={"/NICUForm"}>
                                <button className="btn btn-dark btn-lg">
                                    <div className="">{t("departmentPageSubmitDate")}</div>
                                </button>
                            </Link>
                        </div>

                        <div className='col-auto'>
                            <Link to={"#"}>
                                <button className="btn btn-dark btn-lg">
                                    <div className="">{t("departmentPageBiomechanic")}</div>
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