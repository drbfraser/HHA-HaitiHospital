import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './style/App.css';

import HomePage from './pages/HomePage'
import { DepartmentOne } from "./pages/Department1NICU";
import { DepartmentTwo } from "./pages/Department2Maternity";
import { CaseStudyMain} from "./pages/CaseStudyMain";
import { Post } from "./components/Post";

function App() {
  return (
    <Router>
      <div className="app">
        <Route exact path='/home' component={HomePage}/>
        <Route path="/Department1NICU" exact component={DepartmentOne} />
        <Route path="/Department2Maternity" exact component={DepartmentTwo} />
        <Route path='/caseStudyMain' exact component={CaseStudyMain} />
        {/*<Route path="/posts/:id" exact component={Post} />*/}
        {/*<Route path="/" render={() => <div>404</div>} />*/}
      </div>
    </Router>
  );
}

export default App;
