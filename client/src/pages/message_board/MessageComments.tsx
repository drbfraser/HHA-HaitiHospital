import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
} from 'constants/endpoints';
import { Message, emptyMessage } from 'constants/interfaces';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
  TOAST_MESSAGEBOARD_GET_ERROR,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import MessageComment from 'components/message/MessageComment';
import MessageDisplay from 'components/message/MessageDisplay';
import { useAuthState } from 'contexts';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { ResponseMessage } from 'utils';

const MessageComments = () => {
  const [comments, setComments] = useState([]);
  const [message, setMsgJson] = useState<Message>(emptyMessage);
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
        TOAST_MESSAGEBOARD_GET_ERROR,
        history,
        controller.signal,
      );
      setMsgJson(message);
    };
    async function getComments() {
      const fetchedComments = await Api.Get(
        ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message_id),
        TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
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
      ResponseMessage.getMsgCreateCommentFailed(),
      null,
      ResponseMessage.getMsgCreateCommentOk(),
    );
    reset();
  };

  return (
    <Layout showBackButton title={t('headerMessageComments')}>
      <MessageDisplay message={message} notifyChange={toggleRerender} />
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
          <button className="btn btn-primary mt-3 mb-5">{t('messageBoardAddCommentSubmit')}</button>
        </form>
      </div>
    </Layout>
  );
};

export default MessageComments;
