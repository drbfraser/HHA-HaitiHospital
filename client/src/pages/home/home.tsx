import Layout from 'components/layout';
import DashboardLeaderOverview from '../../components/dashboard_leader_overview/dashboard_leader_overview';
import DashboardMessageOverview from 'components/dashboard_message_overview/dashboard_message_overview';
import './home.css';

interface HomeProps {}

const Home = (props: HomeProps) => {
  return (
    <div className={`home`}>
      <Layout>
        <DashboardLeaderOverview />
        <DashboardMessageOverview />
      </Layout>
    </div>
  );
};

export default Home;
