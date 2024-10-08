import { MessageJson, emptyMessage } from '@hha/common';
import { useCallback, useEffect, useState } from 'react';
import { History } from 'history';
import Layout from 'components/layout';
import MessageForm from 'components/message/MessageForm';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { useHistory } from 'react-router-dom';
import { useParams } from 'react-router';
import { useTranslation } from 'react-i18next';
import { getMessageBoard, updateMessageBoard } from 'api/messageBoard';
import { ResponseMessage } from 'utils';

const EditMessage = () => {
  const { id } = useParams<{ id: string }>();
  const [msg, setMsg] = useState<MessageJson>(emptyMessage);
  const history: History = useHistory<History>();
  const { t } = useTranslation();

  const toCorrectMsg = (msgData: MessageJson): MessageJson => {
    const msg: MessageJson = {
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
    return msg;
  };

  const fetchData = useCallback(async () => {
    const msgData = await getMessageBoard(id, history);
    if (Object.keys(msgData).length === 0) return;
    const msg = toCorrectMsg(msgData);
    setMsg(msg);
  }, [id, history]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateMessageActions = () => {
    history.push('/message-board');
  };

  const updateMessage = async (data: any) => {
    updateMessageBoard(
      id,
      data,
      updateMessageActions,
      ResponseMessage.getMsgCreatePostFailed(),
      ResponseMessage.getMsgCreatePostOk(),
      history,
    );
  };

  return (
    <Layout showBackButton title={t('editMessage')}>
      <MessageForm message={msg} submitAction={updateMessage} />
    </Layout>
  );
};

export default EditMessage;
