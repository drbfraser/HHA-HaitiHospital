import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_POST } from 'constants/endpoints';
import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from '../../components/message/MessageForm';
import { TOAST_MESSAGEBOARD_POST } from 'constants/toastErrorMessages';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddMessage = () => {
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const onSubmitActions = () => {
    history.push('/message-board');
    toast.success(i18n.t('addMessageAlertSuccess'));
  };

  const onSubmit = async (data: any) => {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_POST,
      data,
      onSubmitActions,
      history,
      TOAST_MESSAGEBOARD_POST,
    );
  };

  return (
    <Layout>
      <h1 className="h1">{t('addMessageAddMessage')}</h1>
      <MessageForm submitAction={onSubmit} />
      <div className="add-msg-back-btn">
        <button
          data-testid="add-message-back-button"
          className="btn btn-md btn-outline-secondary"
          onClick={history.goBack}
        >
          {t('addMessageBack')}
        </button>
      </div>
    </Layout>
  );
};

export default AddMessage;
