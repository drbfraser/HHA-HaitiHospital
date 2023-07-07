import DashboardLeaderOverview from '../../components/dashboard/DashboardLeaderOverview';
import DashboardMessageOverview from 'components/dashboard/DashboardMessageOverview';
import Layout from 'components/layout';

const Home = () => (
  <Layout>
    <DashboardLeaderOverview />
    <DashboardMessageOverview />
  </Layout>
);

export default Home;
