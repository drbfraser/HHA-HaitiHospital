import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Json } from 'constants/interfaces';
import Axios from 'axios';
import MessageDisplay from './message_display';
import { useTranslation } from 'react-i18next';
import { renderBasedOnRole } from '../../actions/roleActions';
import { useAuthState } from 'contexts';
import { Role } from '../../constants/interfaces';
import Pagination from 'components/pagination/Pagination';
interface MessagePanelProps {}

const MessagePanel = (props: MessagePanelProps) => {
  const { t } = useTranslation();
  const [rerender, setRerender] = useState<boolean>(false);
  const authState = useAuthState();

  const [msgsJson, setMsgJson] = useState<Json[]>([]);
  const dbApiForMessageBoard: string = '/api/message-board/';

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize: number = 10;
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * pageSize;
    const lastPageIndex = firstPageIndex + pageSize;
    return msgsJson.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, msgsJson]);

  useEffect(() => {
    let isMounted = true;

    const apiSource = Axios.CancelToken.source();
    async function fetchMsgs() {
      try {
        const res = await Axios.get(dbApiForMessageBoard, { cancelToken: apiSource.token });
        return res.data;
      } catch (err) {
        if (Axios.isCancel(err)) {
          console.log(`Info: Request to ${dbApiForMessageBoard} is canceled`, err);
        } else console.log(err);
        return [];
      }
    }

    async function getMsgs() {
      const msgsFromServer = await fetchMsgs();
      if (isMounted === true) setMsgJson(msgsFromServer);
    }

    getMsgs();

    return function leaveSite() {
      apiSource.cancel();
      isMounted = false;
    };
  }, [rerender]);

  const toggleRerender = async () => {
    setRerender(!rerender);
    console.log('Rerendering....');
  };

  return (
    <>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        {/* Add message button */}
        <div className="d-sm-flex align-items-center">
          <h6 className="border-bottom pb-2 mb-0">{t('messageBoardRecentUpdates')}</h6>
          <div className="ml-auto">
            {renderBasedOnRole(authState.userDetails.role, [Role.Admin, Role.MedicalDirector]) ? (
              <Link to="/message-board/add-message">
                <button className="btn btn-md btn-outline-secondary">
                  {t('messageBoardAddMessage')}
                </button>
              </Link>
            ) : null}
          </div>
        </div>

        {/* Messsage row */}
        {currentTableData.map((msgJson, index) => {
          return <MessageDisplay key={index} msgJson={msgJson} notifyChange={toggleRerender} />;
        })}
      </div>
      {/* Pagination bar */}
      <Pagination
        className="pagination-bar"
        currentPage={currentPage}
        totalCount={msgsJson.length}
        pageSize={pageSize}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </>
  );
};

export default MessagePanel;
