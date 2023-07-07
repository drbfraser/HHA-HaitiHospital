import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
} from 'constants/endpoints';
import { Message, emptyMessage } from 'constants/interfaces';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET,
  TOAST_MESSAGEBOARD_COMMENTS_POST,
  TOAST_MESSAGEBOARD_GET,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import MessageComment from 'components/message/MessageComment';
import MessageDisplay from 'components/message/MessageDisplay';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

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

  useEffect(() => {
    const controller = new AbortController();
    const getMessage = async () => {
      const message = await Api.Get(
        ENDPOINT_MESSAGEBOARD_GET_BY_ID(message_id),
        TOAST_MESSAGEBOARD_GET,
        history,
        controller.signal,
      );
      setMsgJson(message);
    };
    async function getComments() {
      const fetchedComments = await Api.Get(
        ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message_id),
        TOAST_MESSAGEBOARD_COMMENTS_GET,
        history,
        controller.signal,
      );
      setComments(fetchedComments);
    }
    getMessage();
    getComments();
    return () => {
      controller.abort();
      setComments([]);
      setMsgJson(emptyMessage);
    };
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
      TOAST_MESSAGEBOARD_COMMENTS_POST,
    );
    reset();
  };

  return (
    <div className="message_comments">
      <Layout>
        <div className="main_container">
          <div className="mb-3 d-flex justify-content-start">
            <button type="button" className="btn btn-outline-dark" onClick={history.goBack}>
              {t('messageBoardCommentsBack')}
            </button>
          </div>
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pb-2 mb-0">{t('messageBoardCommentsMessage')}</h6>
          </div>
          <MessageDisplay message={msgJson} notifyChange={toggleRerender} />
          <div className="d-sm-flex align-items-center">
            <h6 className="border-bottom pt-5 pb-2 mb-0">
              {t('messageBoardCommentsComment') + ' (' + comments.length + ')'}
            </h6>
          </div>
          <div>
            {comments.map((item, index) => (
              <MessageComment key={index} comment={item} />
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
      </Layout>
    </div>
  );
};

export default MessageComments;