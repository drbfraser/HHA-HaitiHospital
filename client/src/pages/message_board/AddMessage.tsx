import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from '../../components/message/MessageForm';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ResponseMessage } from 'utils';

const AddMessage = () => {
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const onSubmitActions = () => {
    history.push('/message-board');
  };

  const onSubmit = async (data: any) => {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_POST,
      data,
      onSubmitActions,
      history,
      ResponseMessage.getMsgCreateMessageFailed(),
      null,
      ResponseMessage.getMsgCreateMessageOk(),
    );
  };

  return (
    <Layout showBackButton title={t('addMessageAddMessage')}>
      <MessageForm submitAction={onSubmit} />
    </Layout>
  );
};

export default AddMessage;
