import React from "react"
import { ElementStyleProps } from 'constants/interfaces'
import SideBar from 'components/side_bar/side_bar'
import Header from 'components/header/header'
import DashboardMessageOverview from "components/dashboard_message_overview/dashboard_message_overview"

// import messages from "../../../../server/src/routes/api/messages";
// import { RouteComponentProps } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

interface HomeProps extends ElementStyleProps {
}

// interface HomeProps extends RouteComponentProps {
// };


const Home = (props : HomeProps) => {
    return (
    <div className={'home '+ (props.classes||'')}>
        <SideBar/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>
            <DashboardMessageOverview messages = {[]}/>
            {/*<DashboardMessageOverview/>*/}
        </main>


      {/*<Header classes='grid'*/}
      {/*  style={{'gridTemplateColumns': '2fr 1fr 1fr'} as CustomCssProps}*/}
      {/*/>*/}
      {/*<LeaderBar classes='grid'*/}
      {/*  style={{'gridTemplateColumns': '2fr 1fr 1fr'} as CustomCssProps}*/}
      {/*/>*/}
      {/*<MessageBoard/>*/}

      {/*<div className="homePage-department">*/}
      {/*    <h1>Departments</h1>*/}
      {/*      /!*<Link to="/department">toDepart</Link>*!/*/}
      {/*      <button className="button1"*/}
      {/*          onClick={() => {*/}
      {/*              // api call*/}
      {/*              // change to the about page*/}
      {/*              props.history.push("/Department1NICU");*/}
      {/*          }}>NICU / PAED</button>*/}
      {/*      <button className="button2"*/}
      {/*              onClick={() => {*/}
      {/*                  props.history.push("/Department2Maternity");*/}
      {/*              }}>MATERNITY</button>*/}
      {/*      <button className="button3"onClick={() => {*/}
      {/*                  props.history.push("/Department3Rehab");*/}
      {/*              }}>REHAB</button>*/}
      {/*      <button className="button4"onClick={() => {*/}
      {/*                  props.history.push("/Department4ComHealth");*/}
      {/*              }}>COM-HEALTH</button>*/}
      {/*    <button className="button5"onClick={() => {*/}
      {/*        props.history.push("/DepartmentMain");*/}
      {/*    }}>MORE</button>*/}
      {/*</div>*/}
      {/*<div className='home-case-study'>*/}
      {/*    <div>*/}
      {/*        <button className="caseStudyButton"*/}
      {/*        onClick={() => {*/}
      {/*            props.history.push("./caseStudyMain");*/}
      {/*        }}>Case Study</button>*/}
      {/*    </div>*/}
      {/*    <div className="caseStudy-image">*/}
      {/*        <img src={case1} className="caseOne" alt="case1"/>*/}
      {/*        <img src={case2} className="caseTwo" alt="case2" />*/}
      {/*    </div>*/}
      {/*</div>*/}

    </div>
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

// import './home_styles.css';

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
