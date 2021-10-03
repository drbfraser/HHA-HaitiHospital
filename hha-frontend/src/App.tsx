import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { DepartmentOne } from "./DepartmentOne";
import { DepartmentTwo } from "./DepartmentTwo";
import { CaseStudyMain} from "./CaseStudyMain";
import { Post } from "./Post";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/departmentOne" exact component={DepartmentOne} />
                <Route path="/departmentTwo" exact component={DepartmentTwo} />
                <Route path='/caseStudyMain' exact component={CaseStudyMain} />
                {/*<Route path="/posts/:id" exact component={Post} />*/}
                {/*<Route path="/" render={() => <div>404</div>} />*/}
            </Switch>
        </BrowserRouter>
    );
};

export default App;