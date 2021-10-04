import * as React from "react";
import { Link, RouteComponentProps } from "react-router-dom";

require("../style/HomeStyle.css");

import case1 from "./img/case1.jpg"
import case2 from "./img/case2.jpg"

import Header from '../components/Header'
import LeaderBar from '../components/LeaderBar'
import MessageBoard from '../components/MessageBoard';
import { MyCustomCSS } from '../components/MyCustomCSS';

interface Props extends RouteComponentProps {}

const HomePage: React.FC<Props> = ({ history, location, match }) => {
    console.log(match, location);
    
    return (
    <>
      <Header classes='header grid'
        style={{'grid-template-columns': '2fr 1fr 1fr'} as MyCustomCSS}
      />
      <LeaderBar classes='leader-bar grid'
        style={{'grid-template-columns': '2fr 1fr 1fr'} as MyCustomCSS}
      />
      <MessageBoard classes='message-board'/>

      <div className="depart">
            <div>This is the second half of the home page</div>
            <p>-------------------------------- my part starts here --------------------------------</p>
            {/*<Link to="/department">toDepart</Link>*/}
            <button className="button1"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/departmentOne");
                }}>NICU / PAED</button>
            <button className="button2"
                    onClick={() => {
                        history.push("/departmentTwo");
                    }}>MATERNITY</button>
            <button className="button3">REHAB</button>
            <button className="button4">COM-HEALTH</button>
            <button className="button5">MORE</button>

            <div>
                <button className="caseStudyButton"
                onClick={() => {
                    history.push("./caseStudyMain");
                }}>Case Study</button>
            </div>
            <div className="caseStudy-image">
                <img src={case1} className="caseOne" alt="case1"/>
                <img src={case2} className="caseTwo" alt="case2" />
            </div>
        </div>
    </>
  );
}

export default HomePage;