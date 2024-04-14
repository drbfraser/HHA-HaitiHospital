import { useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { History } from 'history';
import Layout from 'components/layout';
import { MessageJson as Message, MessageBoardCommentJson as Comment } from '@hha/common';
import MessageComment from 'components/message/MessageComment';
import MessageDisplay from 'components/message/MessageDisplay';
import { ResponseMessage } from 'utils';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getMessageBoard } from 'api/messageBoard';
import { addMessageComment, getMessageComments } from 'api/messageComment';

const MessageComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [message, setMessage] = useState<Message>();

  const { register, handleSubmit, reset } = useForm({});
  const { t } = useTranslation();

  const history: History = useHistory<History>();
  const message_id = useLocation().pathname.split('/')[3];

  const onAddCommentActions = (comment: Comment) => {
    setComments([...comments, comment]);
  };

  const onSubmit = (data: any) => {
    data.parentMessageId = message_id;
    addMessageComment(data, onAddCommentActions, history);
    reset({
      messageComment: '',
    });
  };

  const fetchData = async () => {
    const messageBoard = await getMessageBoard(message_id, history);
    const messageComments = await getMessageComments(message_id, history);
    setMessage(messageBoard);
    setComments(messageComments);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Layout showBackButton title={t('headerMessageComments')}>
      {message && (
        <>
          <MessageDisplay message={message} showCommentsLink={false} onDelete={history.goBack} />
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
