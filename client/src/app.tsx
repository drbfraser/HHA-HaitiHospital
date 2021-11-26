import { BrowserRouter as Router, Route} from 'react-router-dom';
import React, {useEffect} from 'react';

// import './app.css';

import Login from 'pages/login/login'
import Home from 'pages/home/home'
import Admin from 'pages/admin/admin'
import { DepartmentOne } from "pages/department/department_1_nicu";
import { DepartmentTwo } from "pages/department/department_2_maternity";
import { DepartmentThree} from "pages/department/department_3_rehab";
import { DepartmentFour} from "pages/department/department_4_comhealth";
import { CaseStudyMain} from "pages/case_study_main/case_study_main";
import { CaseStudyForm } from 'pages/case_study_forms/case_study_forms';
import { DepartmentMain} from "pages/department/department_main";
import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main"
import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import  DepartmentReport from 'pages/department_report/department_report';
import NICUForm from 'pages/form/nicu_form';
import AddMessage from 'components/message_form/message_form';
import NotFound from 'pages/not_found/not_found';

const App = () => {
    useEffect(() => {
        const script = document.createElement('script');
        
        script.src = "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.0/font/bootstrap-icons.css";
        script.async = true;
        
        document.body.appendChild(script);
        
        return () => {
            document.body.removeChild(script);
        }
    }, []);


  return (
    <div className="app">
        <Router>
        <Route path='/' exact component={Login}/>
        <Route path='/login' exact component={Login}/>
        <Route path='/home' exact component={Home}/>
        <Route path='/admin' exact component={Admin}/>
        <Route path="/Department1NICU" exact component={DepartmentOne} />
        <Route path="/Department2Maternity" exact component={DepartmentTwo} />
        <Route path="/Department3Rehab" exact component={DepartmentThree} />
        <Route path="/Department4ComHealth" exact component={DepartmentFour} />
        <Route path="/departmentMain" exact component={DepartmentMain} />
        <Route path='/caseStudyMain' exact component={CaseStudyMain} />
        <Route path='/caseStudyForm' exact component={CaseStudyForm} />
        <Route path="/leaderBoard" exact component={LeaderBoardMain} />
        <Route path="/messageBoard" exact component={MessageBoardMain} />
        {/* TODO: In the future nest addMessage route inside MessageBoard */}
        <Route path="/addMessage" component={AddMessage} />
        {/* @ts-ignore */}
        <Route path='/Department1NICU/detailed_report/view/:id' exact component = {() => (<DepartmentReport edit={false}/>)} />
        {/* @ts-ignore */}
        <Route path='/Department1NICU/detailed_report/edit/:id' exact component = {() => (<DepartmentReport edit={true}/>)} />
        <Route path="/NICUForm" component={NICUForm} />
        {/*<Route path="/posts/:id" exact component={Post} />*/}
        <Route component={NotFound} />
        </Router>
    </div>
  );
}
export default App;