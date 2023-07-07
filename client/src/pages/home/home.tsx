import DashboardLeaderOverview from '../../components/dashboard_leader_overview/dashboard_leader_overview';
import DashboardMessageOverview from 'components/dashboard_message_overview/dashboard_message_overview';
import Layout from 'components/layout';

const Home = () => (
  <Layout>
    <DashboardLeaderOverview />
    <DashboardMessageOverview />
  </Layout>
);

export default Home;
