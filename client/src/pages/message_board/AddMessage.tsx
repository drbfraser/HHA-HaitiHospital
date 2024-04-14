import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from '../../components/message/MessageForm';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { addMessageBoard } from 'api/messageBoard';

const AddMessage = () => {
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const onSubmitActions = () => {
    history.push('/message-board');
  };

  const onSubmit = async (data: any) => {
    addMessageBoard(data, onSubmitActions, history);
  };

  return (
    <Layout showBackButton title={t('addMessageAddMessage')}>
      <MessageForm submitAction={onSubmit} newForm />
    </Layout>
  );
};

export default AddMessage;
