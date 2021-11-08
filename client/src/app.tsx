import { BrowserRouter as Router, Route} from 'react-router-dom';

import './app.css';

import Login from 'pages/login/login'
import Home from 'pages/home/home'
import Admin from 'pages/admin/admin'
import { DepartmentOne } from "pages/department/department_1_nicu";
import { DepartmentTwo } from "pages/department/department_2_maternity";
import { DepartmentThree} from "pages/department/department_3_rehab";
import { DepartmentFour} from "pages/department/department_4_comhealth";
import { CaseStudyMain} from "pages/case_study_main/case_study_main";
import { DepartmentMain} from "pages/department/department_main";
import { LeaderBoardMain } from "pages/leader_board_main/leader_board_main"
import { MessageBoardMain } from "pages/message_board_main/message_board_main";
import  DepartmentReport from 'pages/department_report/department_report';
import NICUForm from 'pages/form/nicu_form';
import AddMessage from 'components/message_form/message_form';

const App = () => {
  return (
    <Router>
      <div className="app">
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
        {/*<Route path="/" render={() => <div>404</div>} />*/}
      </div>
    </Router>
  );
}
export default App;