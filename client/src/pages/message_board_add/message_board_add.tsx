import { useHistory } from 'react-router-dom';
import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_POST } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_POST } from 'constants/toast_messages';
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
    toast.success(i18n.t('addMessageAlertSuccess'));
  };

  const onSubmit = async (data: any) => {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_POST,
      data,
      onSubmitActions,
      TOAST_MESSAGEBOARD_POST,
      history,
    );
  };

  return (
    <div className="add_message">
      <Sidebar />
      <main className="main_container">
        <Header />
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
      </main>
    </div>
  );
};

export default AddMessage;
