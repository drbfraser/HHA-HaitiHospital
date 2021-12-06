import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { ElementStyleProps, Role, Json } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';
import { renderBasedOnRole } from "actions/roleActions"

import "./biomechanical.css";
import {useTranslation} from "react-i18next";
import { useAuthState } from "Context";





interface BiomechanicalPageProps extends ElementStyleProps {
}

interface BiomechanicalPageProps extends RouteComponentProps {}

export const BiomechanicalPage = (props: BiomechanicalPageProps) => {
    const { t } = useTranslation();
   const [BioReport, setBioReport] = useState([]);
   const authState = useAuthState();

   const BioReportUrl = `/api/biomech/`;
   const getBioReport = async () => {
    const res = await axios.get(BioReportUrl);
    setBioReport(res.data);
  }

  const deleteCaseStudy = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this case study?')) {
        throw new Error("Deletion cancelled")
      }
      const res = await axios.delete(BioReportUrl + '/' + id);
      getBioReport();
    } catch (err) {
      console.log(err);
    }
  }


   useEffect(() => {
    getBioReport();
  }, [])

  return (
      
<div className = 'biomechanical_page'>
<SideBar/>
<main className="container-fluid main-region">
            <Header/>

            <div className="mt-3">

                <section>
                    <div className="row my-2 justify-items-center">

                        <div className='col-sm-6 col-md-6 col-lg-6'>
                            <Link to={"/brokenkit"}>
                                <button type="button" className="btn btn-outline-dark">
                                    {t("bioSupportReportBrokenKit")}
                                </button>
                            </Link>
                        </div>
                        <div className="table-responsive">
                            <table className="table table-hover mt-3">
                                <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Priority</th>
                                    <th scope="col">Author</th>
                                    <th scope="col">Created</th>
                                    <th scope="col">Options</th>
                                </tr>
                                </thead>
                                <tbody>
                                {
                                    BioReport.map((item, index) => {
                                      console.log(index);
                                      console.log(item);
                                      console.log();
                                      return(
                                      <tr key={item._id}>
                                          <th scope="row">{index + 1}</th>
                                          <td scope="row">{item.equipmentPriority}</td>
                                          <td>{item.user ? item.user.name : "[deleted]"}</td>
                                          <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                                          <td>
                                          <Link to={'/bioMechView/' + item._id} className="link-primary text-decoration-none">View </Link>
                                          {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ?
                                          <a href="javascript:void(0)" className="link-primary text-decoration-none" onClick={() => deleteCaseStudy(item._id)}>Delete</a>
                                          : null}
                                          </td>
                                      </tr>
                                      );
                                    })
                                }
                                </tbody>
                            </table>
        </div>
                    </div>
                </section>

            </div>
        </main>
</div>
  );
};
