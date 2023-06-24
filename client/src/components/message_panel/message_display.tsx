import './message_display.css';

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
import { History } from 'history';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import i18n from 'i18next';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { renderBasedOnRole } from 'actions/roleActions';
import { toast } from 'react-toastify';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

interface MessageDisplayProps {
  msgJson: Message;
  notifyChange: Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState<Message>(emptyMessage);
  const history: History = useHistory<History>();
  const authState = useAuthState();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const readableDate = props.msgJson.date.toLocaleString();
  const [commentCount, setCommentCount] = useState<number>(0);
  const is_comment_page: boolean = useLocation().pathname.split('/')[2] === 'comments';
  const author = !!props.msgJson.user ? props.msgJson.user.name : t('status.not_available');

  useEffect(() => {
    const controller = new AbortController();
    setMessage(props.msgJson);

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

    getCommentCount(props.msgJson.id);
    return () => {
      setMessage(emptyMessage);
      controller.abort();
    };
  }, [props.msgJson, history]);

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

  const onModalDelete = (id: string) => {
    deleteMessage(id);
    setDeleteModal(false);
  };

  return (
    <div className="d-flex text-muted pt-2">
      <ModalDelete
        dataTestId="confirm-delete-message-button"
        currentItem={currentIndex}
        show={deleteModal}
        item={'message'}
        onModalClose={onModalClose}
        onModalDelete={onModalDelete}
        history={undefined}
        location={undefined}
        match={undefined}
      ></ModalDelete>

      {/* Message content */}
      <div className="pb-3 mb-0 border-bottom flex-grow-1">
        {/* Message info */}
        <div className="message-info">
          <div className="text-gray-dark">
            <div className="d-flex">
              <div className="mr-auto p-2">
                <p data-testid="message-title" className="title-info">
                  <strong>{message.messageHeader}</strong>
                </p>
                <p className="department-info">{parseEscapedCharacters(message.department.name)}</p>
                <p className="department-info">{author}</p>
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
                        className="btn btn-link text-decoration-none admin-utils"
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
                      className="btn btn-link text-decoration-none admin-utils"
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

                <p className="department-info">{t('messageBoardPostedOn')}</p>
                <p className="department-info">{readableDate}</p>
              </div>
            </div>
          </div>
          <div className="mr-auto p-2">
            <p data-testid="message-body" className="lh-sm message-body">
              {message.messageBody}
            </p>
            {useLocation().pathname.split('/').length < 4 ? (
              <Link className="align-self-center" to={`/message-board/comments/${message.id}`}>
                <button type="button" className="btn btn-link text-decoration-none admin-utils">
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
