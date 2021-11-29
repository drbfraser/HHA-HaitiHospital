import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { ElementStyleProps, Role } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./case_study_main_styles.css";
import {useTranslation} from "react-i18next";
import { useAuthState } from "Context";
import { renderBasedOnRole } from "actions/roleActions"

interface CaseStudyMainProps extends ElementStyleProps {
}

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const authState = useAuthState();


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
      console.log(err);
    }
  }

  useEffect(() => {
    getCaseStudies();
  }, [])

    const {t, i18n} = useTranslation();

  return (
    <div className={"case-study-main "+ props.classes}>
      <SideBar/>
      <main className="container-fluid main-region">
        <Header/>
        <div className="d-flex justify-content-start">
          <Link to="/caseStudyForm"><button type="button" className="btn btn-outline-dark">{t("caseStudyMainAddCaseStudy")}</button></Link>
        </div>

        <div className="table-responsive">
          <table className="table table-hover mt-3">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">{t("caseStudyMainCaseStudyType")}</th>
                <th scope="col">{t("caseStudyMainAuthor")}</th>
                <th scope="col">{t("caseStudyMainCreated")}</th>
                <th scope="col">{t("caseStudyMainLink")}</th>
              </tr>
            </thead>
            <tbody>
              {
                caseStudies.map((item, index) => (
                  <tr key={item._id}>
                    <th scope="row">{index + 1}</th>
                    <td>{item.caseStudyType}</td>
                    <td>{item.user ? item.user.name : "[deleted]"}</td>
                    <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                    <td>
                      <Link to={'/caseStudyView/' + item._id} className="link-primary text-decoration-none">{t("caseStudyMainViewCaseStudy") + " "}</Link>
                      {renderBasedOnRole(authState.userDetails.role, [Role.Admin]) ? 
                      <a href="javascript:void(0)" className="link-primary text-decoration-none" onClick={() => deleteCaseStudy(item._id)}>Delete</a>
                      : null}
                    </td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};
