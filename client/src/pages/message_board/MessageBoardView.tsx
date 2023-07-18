import Layout from 'components/layout';
import MessagePanel from 'components/message/MessagePanel';
import { useTranslation } from 'react-i18next';

export const MessageBoardView = () => {
  const { t } = useTranslation();

  return (
    <Layout title={t('headerMessageBoard')}>
      <MessagePanel />
    </Layout>
  );
};
