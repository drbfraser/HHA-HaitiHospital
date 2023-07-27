import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_DELETE_BY_ID,
} from 'constants/endpoints';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Message, Role, emptyMessage } from 'constants/interfaces';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET,
  TOAST_MESSAGEBOARD_DELETE,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { History } from 'history';
import i18n from 'i18next';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { renderBasedOnRole } from 'actions/roleActions';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

interface MessageDisplayProps {
  message: Message;
  notifyChange: Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<Message>(emptyMessage);
  const history: History = useHistory<History>();
  const authState = useAuthState();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(null);
  const readableDate = props.message.date.toLocaleString();
  const [commentCount, setCommentCount] = useState<number>(0);
  const is_comment_page: boolean = useLocation().pathname.split('/')[2] === 'comments';
  const author = !!props.message.user ? props.message.user.name : t('status.not_available');

  useEffect(() => {
    const controller = new AbortController();
    setMessage(props.message);

    const getCommentCount = async (id: string) => {
      if (id) {
        let comments = await Api.Get(
          ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(id),
          TOAST_MESSAGEBOARD_COMMENTS_GET,
          history,
          controller.signal,
        );
        setCommentCount(comments.length);
      }
    };

    getCommentCount(props.message.id);
    return () => {
      setMessage(emptyMessage);
      controller.abort();
    };
  }, [props.message, history]);

  const deleteMessageActions = () => {
    toast.success(i18n.t('MessageAlertMessageDeleted'));
  };

  const deleteMessage = async (id: string) => {
    await Api.Delete(
      ENDPOINT_MESSAGEBOARD_DELETE_BY_ID(id),
      {},
      deleteMessageActions,
      TOAST_MESSAGEBOARD_DELETE,
      history,
    );
    if (is_comment_page) {
      history.push('/message-board');
    }
    props.notifyChange();
  };

  const onDeleteMessage = (event: any, id: string) => {
    event.stopPropagation();
    event.preventDefault();
    setCurrentIndex(id);
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setCurrentIndex(DEFAULT_INDEX);
    setDeleteModal(false);
  };

  const onModalDelete = () => {
    deleteMessage(currentIndex);
    setDeleteModal(false);
  };

  return (
    <div className="d-flex text-muted pt-2">
      <DeleteModal
        dataTestId="confirm-delete-message-button"
        show={deleteModal}
        itemName={'message'}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
      ></DeleteModal>

      {/* Message content */}
      <div className="pb-3 mb-0 border-bottom flex-grow-1">
        {/* Message info */}
        <div className="message-info">
          <div className="text-gray-dark">
            <div className="d-flex">
              <div className="mr-auto p-2">
                <h5 data-testid="message-title">{message.messageHeader}</h5>
                <p className="small m-0">{parseEscapedCharacters(message.department.name)}</p>
                <p className="small m-0">{author}</p>
              </div>
              <div className="p-2">
                <div>
                  {renderBasedOnRole(authState.userDetails.role, [
                    Role.Admin,
                    Role.MedicalDirector,
                  ]) ? (
                    <Link className="align-self-center" to={`/message-board/edit/${message.id}`}>
                      <button
                        data-testid="edit-message-button"
                        type="button"
                        className="btn btn-sm btn-link text-decoration-none small border-0 p-0 me-2"
                      >
                        {t('messageBoardEdit')}
                      </button>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {renderBasedOnRole(authState.userDetails.role, [
                    Role.Admin,
                    Role.MedicalDirector,
                  ]) ? (
                    <button
                      data-testid="delete-message-button"
                      type="button"
                      className="btn btn-sm btn-link text-decoration-none border-0 p-0"
                      onClick={(event) => {
                        onDeleteMessage(event, message.id);
                      }}
                    >
                      {t('messageBoardDelete')}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <p className="small m-0">{t('messageBoardPostedOn')}</p>
                <p className="small m-0">{readableDate}</p>
              </div>
            </div>
          </div>
          <div className="mr-auto p-2">
            <p data-testid="message-body" className="lh-sm">
              {message.messageBody}
            </p>
            {useLocation().pathname.split('/').length < 4 ? (
              <Link className="align-self-center" to={`/message-board/comments/${message.id}`}>
                <button
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none admin-utils"
                >
                  {t('messageBoardComments') + '(' + commentCount + ')'}
                </button>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
