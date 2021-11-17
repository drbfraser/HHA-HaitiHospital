import { useEffect, useState } from "react";
import { RouteComponentProps, Link } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

import "./case_study_main_styles.css";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = (props: CaseStudyMainProps) => {
  const [caseStudies, setCaseStudies] = useState([]);
  const [caseStudiesChanged, setCaseStudiesChanged] = useState(false);

  const caseStudiesUrl = '/api/casestudies';
  const getCaseStudies = async () => {
    const res = await axios.get(caseStudiesUrl);
    setCaseStudies(res.data);
    setCaseStudiesChanged(true);
  }

  useEffect(() => {
    getCaseStudies();
  }, [caseStudiesChanged])


  return (
    <div className={'case-study-main '+ props.classes}>
      <SideBar/>
      <main className="container">
        <Header/>
        <div className="col-lg-3 col-md-4 col-sm-6 col-8">
          <Link type="button" to="/caseStudyForm" className="btn btn-outline-dark">Add Case Study</Link>
        </div>
        
        <table className="table mt-3 ml-3">
          <thead>
            <tr>
              <th scope="col">Case Study Type</th>
              <th scope="col">Author</th>
              <th scope="col">Created</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {
              caseStudies.map((item) => (
                <tr key={item._id}>
                  <td>{item.caseStudyType}</td>
                  <td>{item.user ? item.user.name : null}</td>
                  <td>{(new Date(item.createdAt)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}</td>
                  <td><Link to={'/caseStudyView/' + item._id} className="link-primary text-decoration-none">View Case Study</Link></td>
                </tr>
              ))
            }
          </tbody>
        </table>

      </main>
    </div>
  );
};



//
//                 <button className="caseTwo-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
// onChange={(val) => setForm(this.value)}
//                 <button className="caseOne-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
//                 <button className="case-study-more-button"
//                         onClick={() => {props.history.push("/caseStudyMain");}}>
//                 </button>
// function setForm(value: any) {

 //              if(value == "form1"){
   //                    document.getElementById('form1')!.style.display = 'hidden';
     //                  }
       //        else if (value == "form2"){

         //              }
           //}