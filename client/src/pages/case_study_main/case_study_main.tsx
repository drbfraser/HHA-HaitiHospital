import { RouteComponentProps} from "react-router-dom";
import { ElementStyleProps } from "constants/interfaces";
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'

import "./case_study_main_styles.css";
import {useTranslation} from "react-i18next";

interface CaseStudyMainProps extends ElementStyleProps {
};

interface CaseStudyMainProps extends RouteComponentProps {};

export const CaseStudyMain = (props: CaseStudyMainProps) => {

    const {t, i18n} = useTranslation();

    return (
        <div className={'case-study-main '+ props.classes}>
            <SideBar/>

            <main className="container">
                <Header/>

                <div className="col-md-4">
                    <button type="button" className="btn btn-primary btn-md" onClick={() => {
                        props.history.push("/caseStudyForm");
                    }}>{t("caseStudyMainAddCaseStudy")}</button>
                </div>

                <script></script>
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