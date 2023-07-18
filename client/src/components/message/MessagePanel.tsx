import { Link, useHistory } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';

import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_GET } from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import { Message } from 'constants/interfaces';
import MessageDisplay from './MessageDisplay';
import Pagination from 'components/pagination/Pagination';
import { Role } from 'constants/interfaces';
import { renderBasedOnRole } from 'actions/roleActions';
import { useAuthState } from 'contexts';
import { useTranslation } from 'react-i18next';

const MessagePanel = () => {
  const { t } = useTranslation();
  const history: History = useHistory<History>();
  const [rerender, setRerender] = useState<boolean>(false);
  const authState = useAuthState();
  const [msgsJson, setMsgJson] = useState<Message[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return msgsJson.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, msgsJson]);

  useEffect(() => {
    const controller = new AbortController();
    const getMessages = async (isMounted: boolean) => {
      if (isMounted) {
        const messages = await Api.Get(
          ENDPOINT_MESSAGEBOARD_GET,
          TOAST_MESSAGEBOARD_GET_ERROR,
          history,
          controller.signal,
        );
        setMsgJson(messages);
      }
    };

    let isMounted: boolean = true;
    getMessages(isMounted);
    return () => {
      controller.abort();
      setMsgJson([]);
    };
  }, [rerender, history, authState]);

  const toggleRerender = async () => {
    setRerender(!rerender);
  };

  return (
    <div className="message-panel">
      <div className="d-flex justify-content-start">
        {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
          <Link to="/message-board/add-message">
            <button data-testid="add-message-button" className="btn btn-md btn-outline-secondary">
              {t('messageBoardAddMessage')}
            </button>
          </Link>
        ) : null}
      </div>
      {msgsJson && (
        <div>
          <div className="my-3 p-3 bg-body rounded shadow-sm">
            <div className="d-sm-flex align-items-center">
              <h6 className="border-bottom pb-2 mb-0">{t('messageBoardRecentUpdates')}</h6>
            </div>
            {currentTableData.map((msgJson, index) => {
              return <MessageDisplay key={index} message={msgJson} notifyChange={toggleRerender} />;
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
    </div>
  );
};

export default MessagePanel;
