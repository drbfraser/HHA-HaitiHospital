import React from 'react';
import { BrowserRouter as Router, Route} from 'react-router-dom';

import './App.css';

import HomePage from './pages/HomePage'
import { DepartmentOne } from "./pages/DepartmentOne";
import { DepartmentTwo } from "./pages/DepartmentTwo";
import { CaseStudyMain} from "./pages/CaseStudyMain";
import { Post } from "./Post";

function App() {
  return (
    <Router>
      <div className="app">
        <Route exact path='/home' component={HomePage}/>
        <Route path="/departmentOne" exact component={DepartmentOne} />
        <Route path="/departmentTwo" exact component={DepartmentTwo} />
        <Route path='/caseStudyMain' exact component={CaseStudyMain} />
        {/*<Route path="/posts/:id" exact component={Post} />*/}
        {/*<Route path="/" render={() => <div>404</div>} />*/}
      </div>
    </Router>
  );
}

export default App;
