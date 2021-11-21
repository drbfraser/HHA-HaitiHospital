import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./case_study_main_styles.css";
import {useTranslation} from "react-i18next";

interface CaseStudyMainProps extends ElementStyleProps {
}

interface CaseStudyMainProps extends RouteComponentProps {}

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [caseStudies, setCaseStudies] = useState([]);


  const caseStudiesUrl = '/api/casestudies';
  const getCaseStudies = async () => {
    const res = await axios.get(caseStudiesUrl);
    setCaseStudies(res.data);
  }

  useEffect(() => {
    getCaseStudies();
  }, [caseStudies.length])

    const {t, i18n} = useTranslation();

  return (
    <div className={"case-study-main "+ props.classes}>
      <SideBar/>
      <main className="container-fluid">
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
                    <th scope="row">{index}</th>
                    <td>{item.caseStudyType}</td>
                    <td>{item.user ? item.user.name : "[deleted]"}</td>
                    <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                    <td><Link to={'/caseStudyView/' + item._id} className="link-primary text-decoration-none">{t("caseStudyMainViewCaseStudy")}</Link></td>
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
