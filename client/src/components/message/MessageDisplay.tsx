import { Link, useHistory } from 'react-router-dom';
import { MessageJson, Role } from '@hha/common';
import { useCallback, useEffect, useState } from 'react';
import { Button } from 'react-bootstrap';
import DeleteModal from 'components/popup_modal/DeleteModal';
import { History } from 'history';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';
import { getMessageComments } from 'api/messageComment';
import { deleteMessageBoard } from 'api/messageBoard';
import { toI18nDateString } from 'constants/date';

interface MessageDisplayProps {
  message: MessageJson;
  onDelete?: (message: MessageJson) => void;
  showCommentsLink?: boolean;
}

const MessageDisplay = ({ message, onDelete, showCommentsLink = true }: MessageDisplayProps) => {
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [commentCount, setCommentCount] = useState<number>(0);

  const { t, i18n } = useTranslation();
  const history: History = useHistory<History>();
  const authState = useAuthState();

  const readableDate = toI18nDateString(message.date, i18n.resolvedLanguage);
  const author = !!message.user ? message.user.name : t('status.not_available');

  const fetchCommentAmount = useCallback(async () => {
    const comments = await getMessageComments(message.id, history);
    setCommentCount(comments.length);
  }, [message.id, history]);

  useEffect(() => {
    fetchCommentAmount();
  }, [fetchCommentAmount]);

  const deleteMessage = async () => {
    deleteMessageBoard(message.id, history);
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

      {/* MessageJson content */}
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
                  <Button
                    data-testid="edit-message-button"
                    title={t('messageBoardEdit')}
                    type="button"
                    variant="link"
                    size="sm"
                    className="p-0 me-2 bi bi-pencil-fill"
                  />
                </Link>
                <Button
                  data-testid="delete-message-button"
                  title={t('messageBoardDelete')}
                  type="button"
                  variant="link"
                  size="sm"
                  className="p-0 bi bi-trash-fill"
                  onClick={onDeleteMessage}
                />
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
