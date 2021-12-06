import { useEffect, useState } from "react";
import { RouteComponentProps, Link, useHistory } from "react-router-dom";
import { Role } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./case_study_main_styles.css";
import {useTranslation} from "react-i18next";
import { useAuthState } from "Context";
import { renderBasedOnRole } from "actions/roleActions"
import DbErrorHandler from "actions/http_error_handler";

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const authState = useAuthState();
  const history = useHistory();


  const caseStudiesUrl = '/api/casestudies';
  const getCaseStudies = async () => {
    const res = await axios.get(caseStudiesUrl);
    setCaseStudies(res.data);
  }

  const deleteCaseStudy = async (id) => {
    try {
      if (!window.confirm('Are you sure you want to delete this case study?')) {
        throw new Error("Deletion cancelled")
      }
      const res = await axios.delete(caseStudiesUrl + '/' + id);
      getCaseStudies();
    } catch (err) {
      DbErrorHandler(err, history);
    }
  }

  useEffect(() => {
    getCaseStudies();
  }, [])

    const {t: translateText} = useTranslation();

  return (
    <div className={"case-study-main"}>
      <SideBar/>
      <main className="container-fluid main-region">
        <Header/>
        <div className="d-flex justify-content-start">
          <Link to="/case-study/form"><button type="button" className="btn btn-outline-dark">{translateText("caseStudyMainAddCaseStudy")}</button></Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{translateText("caseStudyMainCaseStudyType")}</th>
                <th scope="col">{translateText("caseStudyMainAuthor")}</th>
                <th scope="col">{translateText("caseStudyMainCreated")}</th>
                <th scope="col">{translateText("caseStudyMainLink")}</th>
              </tr>
            </thead>
            <tbody>
              {
                caseStudies.map((item, index) => {
                  return(
                  <tr key={item._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.caseStudyType}</td>
                    <td>{item.user ? item.user.name : "[deleted]"}</td>
                    <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                    <td>
                      <Link to={'/case-study/view/' + item._id} className="link-primary text-decoration-none">{translateText("caseStudyMainViewCaseStudy") + " "}</Link>
                      {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? 
                      <a href="javascript:void(0)" className="link-primary text-decoration-none" onClick={() => deleteCaseStudy(item._id)}>{translateText("caseStudyMainDelete")}</a>
                      : null}
                    </td>
                  </tr>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
