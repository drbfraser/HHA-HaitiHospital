import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from "components/header/header";
import DepartmentReports from 'components/department_reports/department_reports';
import './department_1_nicu.css'
import {useTranslation} from "react-i18next";
import {DepartmentName} from 'constants/interfaces'
import DatePicker, {DayRange} from "react-modern-calendar-datepicker";

interface DepartmentProps extends ElementStyleProps {
};

interface DepartmentProps extends RouteComponentProps {
};


export const DepartmentOne = (props : DepartmentProps) => {
    const {t, i18n} = useTranslation();
    const [dayRange, setDayRange] = React.useState<DayRange>({
        from: null,
        to: null
    })

  return (
    <div className={"department-one"}>
        <SideBar/>
        <main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                {/* Department Title */ }
                <section>
                    <h1 className='text-start'>{t("departmentPageNICU/PAED")}</h1>
                </section>

                {/* Functional buttons */}
                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-md-4'>
                            <Link to={"/NICUForm"}>
                                <button className=" btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">{t("departmentPageSubmitDate")}</div>
                                </button>
                            </Link>
                        </div>

                        <div className='col-md-4'>
                            <Link to={"#"}>
                                <button className="btn btn-dark btn-sm rounded-bill">
                                    <div className="lead">{t("departmentPageBiomechanic")}</div>
                                </button>
                            </Link>
                        </div>

                        <div className="col-md-4">
                            <DatePicker
                                value = {dayRange}
                                onChange= {setDayRange}
                            />
                        </div>
                    </div>
                </section>

                {/* Department Report Summary */}
                <section>
                    {/* <DepartmentReports department={"NICU/PAED"}/> */}
                    <DepartmentReports 
                        department={DepartmentName.NicuPaeds}
                        dateRange={dayRange}
                    />
                </section>
            </div>
        </main>

    </div>
  );
};