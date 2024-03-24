import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
} from 'constants/endpoints';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
  TOAST_MESSAGEBOARD_GET_ERROR,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import Api from 'actions/Api';
import { History } from 'history';
import Layout from 'components/layout';
import { MessageJson as Message, MessageBoardCommentJson as Comment } from '@hha/common';
import MessageComment from 'components/message/MessageComment';
import MessageDisplay from 'components/message/MessageDisplay';
import { ResponseMessage } from 'utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const MessageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState<Message>();

  const { register, handleSubmit, reset } = useForm({});
  const { t } = useTranslation();

  const history: History = useHistory<History>();

  const message_id = useLocation().pathname.split('/')[3];

  useEffect(() => {
    const getMessage = async (controller: AbortController) => {
      const message: Message = await Api.Get(
        ENDPOINT_MESSAGEBOARD_GET_BY_ID(message_id),
        TOAST_MESSAGEBOARD_GET_ERROR,
        history,
        controller.signal,
      );
      setMessage(message);
    };

    const controller = new AbortController();

    getMessage(controller);

    return () => {
      controller.abort();
    };
  }, [message_id, history]);

  useEffect(() => {
    async function getComments(controller: AbortController) {
      const comments: Comment[] = await Api.Get(
        ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message_id),
        TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
        history,
        controller.signal,
      );
      setComments(comments);
    }

    const controller = new AbortController();

    getComments(controller);

    return () => {
      controller.abort();
    };
  }, [message_id, history]);

  const onSubmit = (data: any) => {
    data.parentMessageId = message_id;
    Api.Post(
      ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
      data,
      (comment: Comment) => {
        setComments([...comments, comment]);
      },
      history,
      ResponseMessage.getMsgCreateCommentFailed(),
      undefined,
      ResponseMessage.getMsgCreateCommentOk(),
    );
    reset({
      messageComment: '',
    });
  };

  return (
    <Layout showBackButton title={t('headerMessageComments')}>
      {message && (
        <>
          <MessageDisplay
            message={message}
            showCommentsLink={false}
            onDelete={() => {
              history.goBack();
            }}
          />
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
        </>
      )}
    </Layout>
  );
};

export default MessageComments;
