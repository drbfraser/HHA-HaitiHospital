import { useCallback, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import Sidebar from '../../components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID, ENDPOINT_MESSAGEBOARD_GET_BY_ID } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_COMMENTS_GET, TOAST_MESSAGEBOARD_GET } from 'constants/toast_messages';
import './message_board_comments.css';
import { emptyMessage, Message } from 'constants/interfaces';
import MessageComment from 'components/message_comment/message_comment';
import MessageDisplay from 'components/message_panel/message_display';
import { useTranslation } from 'react-i18next';
import { History } from 'history';

const MessageComments = () => {
  const [comments, setComments] = useState([])
  const [msgJson, setMsgJson] = useState<Message>(emptyMessage);
  const [rerender, setRerender] = useState<boolean>(false);
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const message_id = useLocation().pathname.split('/')[3];

  const toggleRerender = async () => {
    setRerender(!rerender);
  };

  const getMessage = async () => {
      const message = await Api.Get(ENDPOINT_MESSAGEBOARD_GET_BY_ID(message_id), TOAST_MESSAGEBOARD_GET, history);
      setMsgJson(message);
  };

  const getComments = useCallback(async () => {
    setComments(await Api.Get(ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message_id), TOAST_MESSAGEBOARD_COMMENTS_GET, history));
  }, [history]);

  useEffect(() => {
    getMessage()
    getComments()
  }, [rerender]);

  return (
    <div className="message_comments">
      <Sidebar />
      <main className="main_container">
        <Header />
        <div className="container">
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pb-2 mb-0">{t('messageBoardCommentsMessage')}</h6>
          </div>
          <MessageDisplay msgJson={msgJson} notifyChange={toggleRerender}/>
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pt-5 pb-2 mb-0">{t('messageBoardCommentsComment')}</h6>
          </div>
          <div>
          {comments.map((item, index) => (
            <MessageComment key={index} commentJson={item}/>
          ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessageComments;
