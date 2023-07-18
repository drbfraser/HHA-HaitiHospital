import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from '../../components/message/MessageForm';
import { TOAST_MESSAGEBOARD_POST_ERROR } from 'constants/toastErrorMessages';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddMessage = () => {
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const onSubmitActions = () => {
    history.push('/message-board');
  };

  const onSubmit = async (data: any) => {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_POST,
      data,
      onSubmitActions,
      history,
      TOAST_MESSAGEBOARD_POST_ERROR,
      null,
      i18n.t('addMessageAlertSuccess'),
    );
  };

  return (
    <Layout showBackButton title={t('addMessageAddMessage')}>
      <MessageForm submitAction={onSubmit} />
    </Layout>
  );
};

export default AddMessage;
