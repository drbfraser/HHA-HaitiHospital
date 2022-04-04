import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { emptyMessage, Message } from 'constants/interfaces';
import Sidebar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import MessageForm from 'components/message_form/message_form';
import './message_board_edit.css';
import Api from 'actions/Api';
import {
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_PUT_BY_ID,
} from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET, TOAST_MESSAGEBOARD_PUT } from 'constants/toast_messages';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { toast } from 'react-toastify';
import { History } from 'history';

const EditMessage = () => {
  const { id } = useParams<{ id?: string }>();
  const [msg, setMsg] = useState<Message>(emptyMessage);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const getMessage = async (id: string) => {
    const msgData: Message = await Api.Get(
      ENDPOINT_MESSAGEBOARD_GET_BY_ID(id),
      TOAST_MESSAGEBOARD_GET,
      history,
    );
    const msg: Message = {
      id: msgData.id,
      messageBody: msgData.messageBody,
      messageHeader: msgData.messageHeader,
      department: {
        id: msgData.department.id,
        name: parseEscapedCharacters(msgData.department.name),
      },
      user: msgData.user,
      date: msgData.date,
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
    await Api.Put(
      ENDPOINT_MESSAGEBOARD_PUT_BY_ID(id),
      data,
      updateMessageActions,
      TOAST_MESSAGEBOARD_PUT,
      history,
    );
  };

  return (
    <div className="edit-message">
      <Sidebar />
      <main>
        <Header />
        <div className="container">
          <h1 className="">{t('editMessage')}</h1>
          <MessageForm optionalMsg={msg} submitAction={updateMessage} />
          <div className="edit-msg-back-btn">
            <button className="btn btn-md btn-outline-secondary" onClick={history.goBack}>
              {t('addMessageBack')}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EditMessage;
