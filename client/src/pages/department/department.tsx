import * as React from "react";
import {useTranslation} from "react-i18next";
import { Link, useParams, useHistory } from "react-router-dom";

import SideBar from 'components/side_bar/side_bar';
import Header from "components/header/header";
import ReportSummary from 'components/report_summary/report_summary';
import {DepartmentName, getDepartmentName} from 'constants/interfaces';
import './department_style.css'

interface DepartmentProps {
}

export const Department = (props : DepartmentProps) => {
    const {t, i18n} = useTranslation();
    const {deptId} = useParams<{deptId:string}>();
    const [ deptName, setDeptName ] = React.useState<DepartmentName>();
    const history = useHistory();

    React.useEffect(() => {
        try {
            const numberId: number = parseInt(deptId);
            const name: DepartmentName = getDepartmentName(numberId);
            setDeptName(name);
        }
        catch (e) {
            console.log("Not found");
            history.push("/notFound");
        }

    },[deptId])

  return (
    <div className='department'>
        <SideBar/>
        <main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                {/* Department Title */ }
                <section>
                    <h1 className='text-start'>{`Department of ${deptName}`}</h1>
                </section>

                {/* Nav buttons */}
                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-sm-6 col-md-6 col-lg-6'>
                            <Link to={`/department/${deptId}/add`}>
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
                    <ReportSummary department={deptName}/>
                </section>
            </div>
        </main>

    </div>
  );
};