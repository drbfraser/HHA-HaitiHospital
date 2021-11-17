import { useEffect, useState } from "react";
import { RouteComponentProps} from "react-router-dom";
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

  const caseStudiesUrl = '/api/casestudies';
  const getCaseStudies = async () => {
    const res = await axios.get(caseStudiesUrl);
    setCaseStudies(res.data);
  }

  useEffect(() => {
    getCaseStudies();
  })


  return (
    <div className={'case-study-main '+ props.classes}>
        <SideBar/>

        <main className="container">
            <Header/>


            <div className="col-md-4">
                <button type="button" className="btn btn-primary btn-md" onClick={() => {
                    props.history.push("/caseStudyForm");
                }}>Add Case Study</button>
            </div>

            
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Case Study Type</th>
                  <th scope="col">Author</th>
                  <th scope="col">Last Updated</th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tbody>
                {
                  caseStudies.map((item) => (
                    <tr key={item._id}>
                      <td>{item.caseStudyType}</td>
                      <td>{item.user}</td>
                      <td>{(new Date(item.updatedAt)).toLocaleString()}</td>
                      <td><a href="#" className="text-decoration-none" onClick={() => props.history.push('/caseStudyView/' + item._id)}>View Case Study</a></td>
                    </tr>
                  ))
                }
              </tbody>
            </table>



        <script>
        </script>

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