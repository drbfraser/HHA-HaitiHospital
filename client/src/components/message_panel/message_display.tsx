import { useState } from 'react';
import { Link } from 'react-router-dom';
import { renderBasedOnRole } from '../../actions/roleActions';
import { useAuthState } from 'contexts';
import { Role } from '../../constants/interfaces';
import { Json } from 'constants/interfaces';
import ModalDelete from 'components/popup_modal/popup_modal_delete';
import Axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

interface MessageDisplayProps {
  msgJson: Json;
  notifyChange: Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
  const { t } = useTranslation();
  const authState = useAuthState();
  const DEFAULT_INDEX: string = '';
  const [deleteModal, setDeleteModal] = useState<boolean>(false);
  const [currentIndex, setCurrentIndex] = useState<string>(DEFAULT_INDEX);

  const deleteMessageFromDb = async (id: string): Promise<boolean> => {
    const deleteMsgApi = `/api/message-board/${id}`;
    try {
      await Axios.delete(deleteMsgApi);
      toast.success(i18n.t('MessageAlertMessageDeleted'));
      return true;
    } catch (err: any) {
      toast.error('Unable to delete message!');
      return false;
    }
  };

  const deleteMessage = async (id: string) => {
    const success = await deleteMessageFromDb(id);
    if (success) props.notifyChange();
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

  let readableDate = new Date(props.msgJson.date as string).toLocaleString();

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
      <svg
        className="bd-placeholder-img flex-shrink-0 me-2 rounded"
        width="32"
        height="32"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Placeholder: 32x32"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
      >
        <title>Placeholder</title>
        <rect width="100%" height="100%" fill="#007bff"></rect>
        <text x="50%" y="50%" fill="#007bff" dy=".3em">
          32x32
        </text>
      </svg>

      {/* Message content */}
      <div className="pb-3 mb-0 border-bottom flex-grow-1">
        {/* Author Id, Deparment, Date */}
        <div className="d-md-flex justify-content-between text-gray-dark">
          <p>
            <strong className="text-gray-dark">
              @{((props.msgJson as Json).userId as Json).name}
            </strong>
          </p>
          <p>
            <strong className="lh-sm">{props.msgJson.departmentName}</strong>
          </p>
          <p>
            <strong className="lh-sm">{readableDate}</strong>
          </p>
        </div>

        {/* Message title */}
        <div className="text-gray-dark">
          <p>
            <strong>
              {t('messageBoardTitle')}: {props.msgJson.messageHeader}
            </strong>
          </p>
        </div>

        {/* Message body with utility buttons */}
        <div className="d-md-flex justify-content-between text-gray-dark text-break">
          <p className="lh-sm">{props.msgJson.messageBody}</p>

          <p className="d-md-flex lh-sm">
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
              <Link
                className="align-self-center"
                to={`/message-board/edit/${props.msgJson['_id']}`}
              >
                <button type="button" className="btn btn-md btn-outline-secondary">
                  <i className="bi bi-pencil"></i>
                </button>
              </Link>
            ) : (
              <div></div>
            )}

            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
              <button
                type="button"
                className="btn btn-md btn-outline-secondary"
                onClick={(event) => {
                  onDeleteMessage(event, props.msgJson['_id'] as string);
                }}
              >
                <i className="bi bi-trash"></i>
              </button>
            ) : (
              <div></div>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default MessageDisplay;
