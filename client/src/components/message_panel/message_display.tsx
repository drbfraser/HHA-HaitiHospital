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
import './message_display.css';

interface MessageDisplayProps {
  msgJson: Json;
  notifyChange: Function;
}

const MessageDisplay = (props: MessageDisplayProps) => {
  const { t: translateText } = useTranslation();
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
      ></ModalDelete>

      {/* Message content */}
      <div className="pb-3 mb-0 border-bottom flex-grow-1">

        {/* Message info */}
        <div className="message-info">
          <div className="text-gray-dark">
            <div className="d-flex">
              <div className="mr-auto p-2">
                <p className="title-info">
                  <strong>
                    {props.msgJson.messageHeader}
                  </strong>
                </p>
                <p className="department-info">
                  {props.msgJson.departmentName} <br />
                  {((props.msgJson as Json).userId as Json).name}
                </p>
              </div>
              <div className="p-2">
              <div className="">

                  {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
                    <Link
                      className="align-self-center"
                      to={`/message-board/edit/${props.msgJson['_id']}`}
                    >
                      <button type="button" 
                        className="btn btn-link text-decoration-none admin-utils">
                        {translateText('messageBoardEdit')}
                      </button>
                    </Link>
                  ) : (
                    <div></div>
                  )}

                  {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
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

                <p className="department-info">
                {translateText('messageBoardPostedOn')} <br/> {readableDate}
                </p>
              </div>
            </div>
          </div>
          <p className="lh-sm message-body">{props.msgJson.messageBody}</p>
        </div>

      </div>
    </div>
  );
};

export default MessageDisplay;
