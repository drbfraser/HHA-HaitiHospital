import { useHistory } from 'react-router-dom';
import Layout from 'components/layout';
import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_POST } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_POST_ERROR } from 'constants/toastErrorMessages';
import './message_board_add.css';
import { toast } from 'react-toastify';
import MessageForm from '../../components/message_form/message_form';
import { useTranslation } from 'react-i18next';
import { History } from 'history';

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
    <div className="add_message">
      <Layout>
        <div className="container">
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
        </div>
      </Layout>
    </div>
  );
};

export default AddMessage;
