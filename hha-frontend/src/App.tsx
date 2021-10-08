import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import { Home } from "./Home";
import { DepartmentOne } from "./Department1NICU";
import { DepartmentTwo } from "./Department2Maternity";
import { DepartmentThree} from "./Department3Rehab";
import { DepartmentFour} from "./Department4ComHealth";
import { CaseStudyMain} from "./CaseStudyMain";
import { Post } from "./Post";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/Department1NICU" exact component={DepartmentOne} />
                <Route path="/Department2Maternity" exact component={DepartmentTwo} />
                <Route path="/Department3Rehab" exact component={DepartmentThree} />
                <Route path="/Department4ComHealth" exact component={DepartmentFour} />
                <Route path='/CaseStudyMain' exact component={CaseStudyMain} />
                {/*<Route path="/posts/:id" exact component={Post} />*/}
                {/*<Route path="/" render={() => <div>404</div>} />*/}
            </Switch>
        </BrowserRouter>
    );
};

export default App;
