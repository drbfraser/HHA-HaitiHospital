import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Sidebar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
} from 'constants/endpoints';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET,
  TOAST_MESSAGEBOARD_COMMENTS_POST,
  TOAST_MESSAGEBOARD_GET,
} from 'constants/toast_messages';
import './message_board_comments.css';
import { emptyMessage, Message } from 'constants/interfaces';
import MessageComment from 'components/message_comment/message_comment';
import MessageDisplay from 'components/message_panel/message_display';
import { useTranslation } from 'react-i18next';
import { History } from 'history';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';

const MessageComments = () => {
  const [comments, setComments] = useState([]);
  const [msgJson, setMsgJson] = useState<Message>(emptyMessage);
  const [rerender, setRerender] = useState<boolean>(false);
  const history: History = useHistory<History>();
  const { register, handleSubmit, reset } = useForm({});
  const { t } = useTranslation();
  const authState = useAuthState();

  const message_id = useLocation().pathname.split('/')[3];

  const toggleRerender = async () => {
    setRerender(!rerender);
  };

  const getMessage = async () => {
    const message = await Api.Get(
      ENDPOINT_MESSAGEBOARD_GET_BY_ID(message_id),
      TOAST_MESSAGEBOARD_GET,
      history,
    );
    setMsgJson(message);
  };

  async function getComments() {
    const fetchedComments = await Api.Get(
      ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message_id),
      TOAST_MESSAGEBOARD_COMMENTS_GET,
      history,
    );
    setComments(fetchedComments);
  }

  useEffect(() => {
    getMessage();
    getComments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerender, message_id, history, authState.userDetails]);

  const onSubmitActions = () => {
    toast.success('Successfully added comment');
    reset({});
    toggleRerender();
  };

  const onSubmit = (data: any) => {
    data.parentMessageId = message_id;
    Api.Post(
      ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
      data,
      onSubmitActions,
      history,
      TOAST_MESSAGEBOARD_COMMENTS_POST
    );
    reset();
  };

  return (
    <div className="message_comments">
      <Sidebar />
      <main className="main_container">
        <Header />
        <div className="container">
          <div className="mb-3 d-flex justify-content-start">
            <button type="button" className="btn btn-outline-dark" onClick={history.goBack}>
              {t('messageBoardCommentsBack')}
            </button>
          </div>
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pb-2 mb-0">{t('messageBoardCommentsMessage')}</h6>
          </div>
          <MessageDisplay msgJson={msgJson} notifyChange={toggleRerender} />
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pt-5 pb-2 mb-0">
              {t('messageBoardCommentsComment') + ' (' + comments.length + ')'}
            </h6>
          </div>
          <div>
            {comments.map((item, index) => (
              <MessageComment key={index} commentJson={item} />
            ))}
          </div>
          <div className="d-sm-flex align-items-center">
            <h6 className="pt-5 pb-2 mb-2">{t('messageBoardAddComment')}</h6>
          </div>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <input
                className="form-control"
                type="text"
                {...register('messageComment', { required: true })}
                defaultValue={''}
              />
              <button className="btn btn-primary mt-3 mb-5">
                {t('messageBoardAddCommentSubmit')}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MessageComments;
