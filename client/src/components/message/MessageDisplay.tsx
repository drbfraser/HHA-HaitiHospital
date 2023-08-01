import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_DELETE_BY_ID,
} from 'constants/endpoints';
import { Link, useHistory } from 'react-router-dom';
import { Message, Role } from 'constants/interfaces';
import {
  TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
  TOAST_MESSAGEBOARD_DELETE_ERROR,
} from 'constants/toastErrorMessages';
import { useEffect, useState } from 'react';

import Api from 'actions/Api';
import { Button } from 'react-bootstrap';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { History } from 'history';
import i18n from 'i18next';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

interface MessageDisplayProps {
  message: Message;
  onDelete?: (message: Message) => void;
  showCommentsLink?: boolean;
}

const MessageDisplay = ({ message, onDelete, showCommentsLink = true }: MessageDisplayProps) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const authState = useAuthState();

  const readableDate = message.date.toLocaleString();
  const author = !!message.user ? message.user.name : t('status.not_available');

  useEffect(() => {
    const getCommentCount = async (controller: AbortController, message: Message) => {
      let comments = await Api.Get(
        ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(message.id),
        TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
        history,
        controller.signal,
      );
      setCommentCount(comments.length);
    };

    const controller = new AbortController();
    getCommentCount(controller, message);
    return () => {
      controller.abort();
    };
  }, [message, history]);

  const deleteMessage = async () => {
    await Api.Delete(
      ENDPOINT_MESSAGEBOARD_DELETE_BY_ID(message.id),
      {},
      null,
      history,
      TOAST_MESSAGEBOARD_DELETE_ERROR,
      null,
      i18n.t('MessageAlertMessageDeleted'),
    );
    onDelete && onDelete(message);
  };

  const onDeleteMessage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setDeleteModal(true);
  };

  const onModalClose = () => {
    setDeleteModal(false);
  };

  const onModalDelete = () => {
    deleteMessage();
    setDeleteModal(false);
  };

  return (
    <div className="d-flex text-muted">
      <DeleteModal
        dataTestId="confirm-delete-message-button"
        show={deleteModal}
        itemName={'message'}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
      ></DeleteModal>

      {/* Message content */}
      <div className="flex-grow-1">
        <div className="d-flex">
          <div className="mr-auto p-2">
            <h5 data-testid="message-title">{message.messageHeader}</h5>
            <p className="small m-0">{parseEscapedCharacters(message.department.name)}</p>
            <p className="small m-0">{author}</p>
          </div>
          <div className="p-2">
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) && (
              <>
                <Link className="align-self-center" to={`/message-board/edit/${message.id}`}>
                  <button
                    data-testid="edit-message-button"
                    type="button"
                    className="btn btn-sm btn-link text-decoration-none small border-0 p-0 me-2"
                  >
                    {t('messageBoardEdit')}
                  </button>
                </Link>
                <Button
                  data-testid="delete-message-button"
                  type="button"
                  className="btn btn-sm btn-link text-decoration-none border-0 p-0"
                  onClick={onDeleteMessage}
                >
                  {t('messageBoardDelete')}
                </Button>
              </>
            )}

            <p className="small m-0">{t('messageBoardPostedOn')}</p>
            <p className="small m-0">{readableDate}</p>
          </div>
        </div>
        <div className="mr-auto p-2">
          <p data-testid="message-body" className="lh-sm">
            {message.messageBody}
          </p>
          {showCommentsLink && (
            <Link className="align-self-center small" to={`/message-board/comments/${message.id}`}>
              {t('messageBoardComments') + '(' + commentCount + ')'}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
