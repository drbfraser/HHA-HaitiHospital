import { useEffect, useState } from "react";
import { RouteComponentProps, useLocation } from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import axios from 'axios';

interface CaseStudyViewProps extends ElementStyleProps {
}

interface CaseStudyViewProps extends RouteComponentProps {}

export const CaseStudyView = (props: CaseStudyViewProps) => {
  const [caseStudy, setCaseStudy] = useState(null);
  const id = useLocation().pathname.split('/')[2];
  // console.log(id);
  const caseStudyUrl = `/api/casestudies/${id}`;
  // console.log(caseStudyUrl);

  const getCaseStudy = async () => {
    const res = await axios.get(caseStudyUrl);
    setCaseStudy(res.data);
    // console.log(res.data);
  }

  useEffect(() => {
    getCaseStudy();
  });
  // console.log(caseStudy);

  return (
    // <div className={'case-study-view '+ props.classes}>
    // <SideBar/>
    // <main className="container">
    //   <Header/>
    //   <div>
    //     <h3>Case Study/Story</h3>
    //     <text>{caseStudy.otherStory.caseStudyStory}</text>
    //   </div>
    // </main>
    // </div>
    <div className={'case-study-main '+ props.classes}>
      <SideBar/>
      <main className="container">
        <Header/>
        {caseStudy !== null ? 
        <div>
          <h3>Case Study/Story</h3>
          <text>{caseStudy.otherStory.caseStudyStory}</text>
        </div>
        : null}
      </main>
    </div>
  )
}
