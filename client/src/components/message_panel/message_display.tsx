import { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { renderBasedOnRole } from '../../actions/roleActions';
import { useAuthState } from 'contexts';
import { UserJson, Role } from '../../constants/interfaces';
import { Json } from 'constants/interfaces';
import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_DELETE_BY_ID } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_DELETE } from 'constants/toast_messages';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { History } from 'history';
import initialUserJson from './initialUserJson.json';
import './message_display.css';

interface MessageDisplayProps {
  msgJson: Json;
  notifyChange: Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
  const { t: translateText } = useTranslation();
  const [author, setAuthor] = useState<UserJson>(initialUserJson as UserJson);
  const history: History = useHistory<History>();
  const authState = useAuthState();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);
  const readableDate = new Date(props.msgJson.date as string).toLocaleString();
  const parsedDepartmentName = parseEscapedCharacters(props.msgJson.departmentName as string);

  useEffect(() => {
    const retrievedUser = props.msgJson.userId as unknown;
    setAuthor(retrievedUser as UserJson);
  }, [props.msgJson]);

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
                <p className="title-info">
                  <strong>{props.msgJson.messageHeader}</strong>
                </p>
                {/* {console.log(author.role)} */}
                <p className="department-info">
                  {parsedDepartmentName}
                </p>
                <p className="department-info">{((props.msgJson as Json).userId as Json).name}</p>
              </div>
              <div className="p-2">
                <div>
                  {renderBasedOnRole(authState.userDetails.role, [
                    Role.Admin,
                    Role.MedicalDirector,
                  ]) ? (
                    <Link
                      className="align-self-center"
                      to={`/message-board/edit/${props.msgJson['_id']}`}
                    >
                      <button
                        type="button"
                        className="btn btn-link text-decoration-none admin-utils"
                      >
                        {translateText('messageBoardEdit')}
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
                      type="button"
                      className="btn btn-link text-decoration-none admin-utils"
                      onClick={(event) => {
                        onDeleteMessage(event, props.msgJson['_id'] as string);
                      }}
                    >
                      {translateText('messageBoardDelete')}
                    </button>
                  ) : (
                    <div></div>
                  )}
                </div>

                <p className="department-info">{translateText('messageBoardPostedOn')}</p>
                <p className="department-info">{readableDate}</p>
              </div>
            </div>
          </div>
          <div className="mr-auto p-2">
            <p className="lh-sm message-body">{props.msgJson.messageBody}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
