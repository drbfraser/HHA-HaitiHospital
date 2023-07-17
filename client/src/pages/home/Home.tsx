import DashboardLeaderOverview from '../../components/dashboard/DashboardLeaderOverview';
import DashboardMessageOverview from 'components/dashboard/DashboardMessageOverview';
import Layout from 'components/layout';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('headerOverview')}>
      <DashboardLeaderOverview />
      <DashboardMessageOverview />
    </Layout>
  );
};

export default Home;
