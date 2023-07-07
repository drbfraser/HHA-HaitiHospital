import {
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_PUT_BY_ID,
} from 'constants/endpoints';
import { Message, emptyMessage } from 'constants/interfaces';
import { TOAST_MESSAGEBOARD_GET, TOAST_MESSAGEBOARD_PUT } from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from 'components/message/MessageForm';
import i18n from 'i18next';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { toast } from 'react-toastify';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';

const EditMessage = () => {
  const { id } = useParams<{ id?: string }>();
  const [msg, setMsg] = useState<Message>(emptyMessage);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  useEffect(() => {
    const controller = new AbortController();
    const getMessage = async (id: string) => {
      const msgData: Message = await Api.Get(
        ENDPOINT_MESSAGEBOARD_GET_BY_ID(id),
        TOAST_MESSAGEBOARD_GET,
        history,
        controller.signal,
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
    getMessage(id);
    return () => {
      setMsg(emptyMessage);
      controller.abort();
    };
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
      history,
      TOAST_MESSAGEBOARD_PUT,
    );
  };

  return (
    <Layout showBackButton title={t('editMessage')}>
      <MessageForm message={msg} submitAction={updateMessage} />
    </Layout>
  );
};

export default EditMessage;
