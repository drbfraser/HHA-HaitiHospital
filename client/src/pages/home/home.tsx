import React, { useEffect } from "react"
import { ElementStyleProps } from 'constants/interfaces'
import SideBar from 'components/side_bar/side_bar'
import Header from 'components/header/header'
import DashboardLeaderOverview from "../../components/dashboard_leader_overview/dashboard_leader_overview";
import DashboardMessageOverview from "components/dashboard_message_overview/dashboard_message_overview"
import './home.css'
import {useTranslation} from "react-i18next";

// import messages from "../../../../server/src/routes/api/messages";
// import { RouteComponentProps } from "react-router-dom";
// import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap.min.css';

interface HomeProps extends ElementStyleProps {
}

// interface HomeProps extends RouteComponentProps {
// };


const Home = (props : HomeProps) => {
    useEffect(() => {
      // TODO: Potential fix for hiding componnet by force refreshing. Problem: infinite loop refresh
      // window.location.reload();
    }, []);
    function getClassName() {
        if (props.classes === undefined) 
          return "home";
        else 
          return `home ${props.classes} `
    }

    return (
    <div className={getClassName()}>
        <SideBar/>

        {/* <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4"> */}
        <main className='container-fluid main-region'>
            <Header/>
            <DashboardLeaderOverview/>
            <DashboardMessageOverview messages = {[]}/>
        </main>

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
