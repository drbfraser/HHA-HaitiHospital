import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { emptyMessage, Message } from 'constants/interfaces';
import Sidebar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import MessageForm from 'components/message_form/message_form';
import './message_board_edit.css';
import API from '../../actions/apiActions';
import { ENDPOINT_MESSAGEBOARD_GET, ENDPOINT_MESSAGEBOARD_PUT } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET, TOAST_MESSAGEBOARD_PUT } from 'constants/toast_messages';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';

const EditMessage = () => {
  const { id } = useParams<{ id?: string }>();
  const [msg, setMsg] = useState<Message>(emptyMessage);
  const history = useHistory();
  const { t } = useTranslation();

  const getMessage = async (id: string) => {
    const msgData = await API.Get(ENDPOINT_MESSAGEBOARD_GET(id), TOAST_MESSAGEBOARD_GET, history);
    const msg: Message = {
      messageBody: msgData['messageBody'],
      messageHeader: msgData['messageHeader'],
      departmentId: msgData['departmentId'],
      departmentName: msgData['departmentName'],
      user: msgData['userId'],
      date: msgData['date'],
    };
    setMsg(msg);
  };

  useEffect(() => {
    getMessage(id);
  }, [id, history]);

  const updateMessageActions = () => {
    history.push('/message-board');
    toast.success(i18n.t('addMessageAlertSuccess'));
  };

  const updateMessage = async (data: any) => {
    await API.Put(
      ENDPOINT_MESSAGEBOARD_PUT(id),
      data,
      updateMessageActions,
      TOAST_MESSAGEBOARD_PUT,
      history,
    );
  };

  return (
    <>
      <div className="edit-message">
        <Sidebar />
        <main>
          <Header />
          <div className="container">
            <h1 className="">{t('editMessage')}</h1>
            <MessageForm optionalMsg={msg} submitAction={updateMessage} />
            <br />
            <button className="btn btn-md btn-outline-secondary" onClick={history.goBack}>
              {t('addMessageBack')}
            </button>
          </div>
        </main>
      </div>
    </>
  );
};

export default EditMessage;
