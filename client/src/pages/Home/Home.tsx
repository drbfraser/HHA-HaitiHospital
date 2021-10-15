import * as React from "react";
import { RouteComponentProps } from "react-router-dom";

import Header from 'components/Header/Header';
import LeaderBar from 'components/LeaderBar/LeaderBar';
import MessageBoard from 'components/MessageBoard/MessageBoard';
import CustomCssProps from 'components/ICustomCSS/ICustomCSS';
import ElementStyleProps from 'components/IProps/IProps';

import case1 from "img/case1.jpg";
import case2 from "img/case2.jpg";
import "./styles.css";

interface IHome extends ElementStyleProps {
};

interface IHome extends RouteComponentProps {
};

const Home = ({ history, location, match } : IHome) => {
  console.log(match, location);
  return (
    <>
      <Header classes='header grid'
        style={{'gridTemplateColumns': '2fr 1fr 1fr'} as CustomCssProps}
      />
      <LeaderBar classes='leader-bar grid'
        style={{'gridTemplateColumns': '2fr 1fr 1fr'} as CustomCssProps}
      />
      <MessageBoard classes='message-board'/>

      <div className="homePage-department">
          <h1>Departments</h1>
            {/*<Link to="/department">toDepart</Link>*/}
            <button className="button1"
                onClick={() => {
                    // api call
                    // change to the about page
                    history.push("/Department1NICU");
                }}>NICU / PAED</button>
            <button className="button2"
                    onClick={() => {
                        history.push("/Department2Maternity");
                    }}>MATERNITY</button>
            <button className="button3"onClick={() => {
                        history.push("/Department3Rehab");
                    }}>REHAB</button>
            <button className="button4"onClick={() => {
                        history.push("/Department4ComHealth");
                    }}>COM-HEALTH</button>
          <button className="button5"onClick={() => {
              history.push("/DepartmentMain");
          }}>MORE</button>

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

export default Home;




// Commented out during JS to TS for future reference
// import React from 'react';
// import { compose } from 'redux';
// import { connect } from 'react-redux';
// import { Link } from 'react-router-dom';

// import Layout from '../../layout/Layout';
// import MessageList from '../../components/MessageList/MessageList';
// import MessageForm from '../../components/MessageForm/MessageForm';
// import { reseedDatabase } from '../../store/actions/authActions';

// import './styles.css';

// const Home = ({ auth, reseedDatabase }) => {
//   const handleReseed = () => {
//     reseedDatabase();
//   };

//   return (
//     <Layout>
//       <div className="home-page">
//         <h1>Home page</h1>
//         {!auth.isAuthenticated ? (
//           <div>
//             <p>
//               Welcome guest!{' '}
//               <Link className="bold" to="/login">
//                 Log in
//               </Link>{' '}
//               or{' '}
//               <Link className="bold" to="/register">
//                 Register
//               </Link>
//             </p>
//             <ReseedMessage handleReseed={handleReseed} />
//           </div>
//         ) : (
//           <>
//             <p>
//               Welcome <span className="name">{auth.me.name}</span>!
//             </p>
//             <ReseedMessage handleReseed={handleReseed} />
//             <MessageForm />
//           </>
//         )}
//         <MessageList />
//       </div>
//     </Layout>
//   );
// };

// const mapStateToProps = (state) => ({
//   auth: state.auth,
// });

// export default compose(connect(mapStateToProps, { reseedDatabase }))(Home);
