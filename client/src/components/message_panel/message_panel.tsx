import { useEffect, useState, useMemo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Json } from 'constants/interfaces';
import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_GET } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET } from 'constants/toast_messages';
import MessageDisplay from './message_display';
import { useTranslation } from 'react-i18next';
import { renderBasedOnRole } from '../../actions/roleActions';
import { useAuthState } from 'contexts';
import { Role } from '../../constants/interfaces';
import Pagination from 'components/pagination/Pagination';
import { History } from 'history';
import { getDepartmentId } from '../../common/utils/departments';

interface MessagePanelProps {}

const MessagePanel = (props: MessagePanelProps) => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const [rerender, setRerender] = useState<boolean>(false);
  const authState = useAuthState();
  const [msgsJson, setMsgJson] = useState<Json[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return msgsJson.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, msgsJson]);

  let messages = [];

  const getMessages = async (isMounted: boolean) => {
    if (isMounted === true) {
      const messages = await Api.Get(ENDPOINT_MESSAGEBOARD_GET, TOAST_MESSAGEBOARD_GET, history);
      const filteredMessages = filterMessages(messages);
      setMsgJson(filteredMessages);
    }
  };

  useEffect(() => {
    let isMounted: boolean = true;
    getMessages(isMounted);
  }, [rerender]);

  const toggleRerender = async () => {
    setRerender(!rerender);
  };

  const filterMessages = (messagesToBeFiltered) => {
    if (renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector, Role.HeadOfDepartment])) {
      console.log("here0")
      return messagesToBeFiltered;
    }
    console.log("WE SHOULD BE HERE");
    return filterMessagesBasedOnDepartment(messagesToBeFiltered);
  }

  const filterMessagesBasedOnDepartment = (messagesToBeFiltered): void => {
    const currentUserDepartment = authState.userDetails.department;
    console.log(messagesToBeFiltered);
    console.log("Above is the msgsJson")
    const filteredMsgs = messagesToBeFiltered.filter((message) => 
      message.departmentId === getDepartmentId(currentUserDepartment)
    )
    console.log(filteredMsgs);
    console.log("above is the filtered msgs")
    // setMsgJson(filteredMsgs);
    // console.log(msgsJson);
  }

  return (
    <div className="message-panel">
      <div className="ml-3 d-flex justify-content-start">
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
          <Link to="/message-board/add-message">
            <button className="btn btn-md btn-outline-secondary">
              {t('messageBoardAddMessage')}
            </button>
          </Link>
        ) : null}
      </div>
      {msgsJson.length > 0 && (
        <div>
                <div className="my-3 p-3 bg-body rounded shadow-sm">

                <div className="d-sm-flex align-items-center">
                  <h6 className="border-bottom pb-2 mb-0">{t('messageBoardRecentUpdates')}</h6>
                </div>
        
                {currentTableData.map((msgJson, index) => {
                  return <MessageDisplay key={index} msgJson={msgJson} notifyChange={toggleRerender} />;
                })}
              </div>
              <Pagination
                className="pagination-bar"
                currentPage={currentPage}
                totalCount={msgsJson.length}
                pageSize={pageSize}
                onPageChange={(page) => setCurrentPage(page)}
            />
        </div>
      )}
      {/* <div className="my-3 p-3 bg-body rounded shadow-sm">

        <div className="d-sm-flex align-items-center">
          <h6 className="border-bottom pb-2 mb-0">{t('messageBoardRecentUpdates')}</h6>
        </div>

        {currentTableData.map((msgJson, index) => {
          return <MessageDisplay key={index} msgJson={msgJson} notifyChange={toggleRerender} />;
        })}
      </div>
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={msgsJson.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      /> */}
    </div>
  );
};

export default MessagePanel;
