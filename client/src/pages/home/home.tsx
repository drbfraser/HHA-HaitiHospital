import React from "react";
import { ElementStyleProps } from 'constants/interfaces'
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header'
import { NavLink } from "react-router-dom";
// import { RouteComponentProps } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './home_styles.css'
import { useLocation } from 'react-router-dom'

interface HomeProps extends ElementStyleProps {
};

// interface HomeProps extends RouteComponentProps {
// };



const Home = (props : HomeProps) => {
    return (
    <div className={'home '+ (props.classes||'')}>
        <SideBar/>

        <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <Header/>

            <div className="my-3 p-3 bg-body rounded shadow-sm">
                <h5 className="pb-2 mb-3">Message Board</h5>

                <div className="d-flex justify-content-between border-bottom pb-2 mb-0 row">
                    <h6 className="text-secondary col">Message</h6>
                    <h6 className="text-secondary col-md-3">Creator</h6>
                    <h6 className="text-secondary col-md-3">Date</h6>
                    <h6 className="text-secondary col-md-1">Priority</h6>
                </div>

                <div className="d-flex text-muted pt-3">
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                        <div className="d-flex row">
                            <span className="text-black col">A message is defined as information conveyed by words and/or other signs and symbols.</span>
                            <span className="text-black col-md-3">Creator's full name</span>
                            <span className="text-black col-md-3">May 26, 2021</span>
                            <span className="text-black col-md-1">HIGH</span>
                        </div>
                        <div className="d-flex justify-content-between row">
                            <span className="text-black-50 col">Updated 1 day ago</span>
                            <span className="text-black-50 col-md-3">on 24-05-2021</span>
                            <span className="text-black-50 col-md-3">8:00 AM</span>
                            <span className="text-black-50 col-md-1"/>
                        </div>
                    </div>
                </div>

                <div className="d-flex text-muted pt-3">
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                        <div className="d-flex row">
                            <span className="text-black col">A message is defined as ...</span>
                            <span className="text-black col-md-3">Creator's full name</span>
                            <span className="text-black col-md-3">May 26, 2021</span>
                            <span className="text-black col-md-1">HIGH</span>
                        </div>
                        <div className="d-flex justify-content-between row">
                            <span className="text-black-50 col">Updated 1 day ago</span>
                            <span className="text-black-50 col-md-3">on 24-05-2021</span>
                            <span className="text-black-50 col-md-3">8:00 AM</span>
                            <span className="text-black-50 col-md-1"/>
                        </div>
                    </div>
                </div>

                <div className="d-flex text-muted pt-3">
                    <div className="pb-3 mb-0 small lh-sm border-bottom w-100">
                        <div className="d-flex row">
                            <span className="text-black col">A message is defined as ...</span>
                            <span className="text-black col-md-3">Creator's full name</span>
                            <span className="text-black col-md-3">May 26, 2021</span>
                            <span className="text-black col-md-1">HIGH</span>
                        </div>
                        <div className="d-flex justify-content-between row">
                            <span className="text-black-50 col">Updated 1 day ago</span>
                            <span className="text-black-50 col-md-3">on 24-05-2021</span>
                            <span className="text-black-50 col-md-3">8:00 AM</span>
                            <span className="text-black-50 col-md-1"/>
                        </div>
                    </div>
                </div>

                <small className="d-block text-end mt-3">
                    <a href="#">All suggestions</a>
                </small>
            </div>

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
