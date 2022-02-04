import React, { useEffect } from 'react';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import DashboardLeaderOverview from '../../components/dashboard_leader_overview/dashboard_leader_overview';
import DashboardMessageOverview from 'components/dashboard_message_overview/dashboard_message_overview';
import './home.css';
import { useTranslation } from 'react-i18next';

interface HomeProps {}

const Home = (props: HomeProps) => {
  return (
    <div className={`home`}>
        <SideBar/>

        <main className='container-fluid main-region'>
            <Header/>
            <DashboardLeaderOverview/>
            <DashboardMessageOverview/>
        </main>

    </div>
  );
};

export default Home;
