import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { Json } from 'constants/interfaces';
import Axios from 'axios';
import MessageDisplay from './message_display';
import { useTranslation } from 'react-i18next';
import { renderBasedOnRole } from '../../actions/roleActions';
import { useAuthState } from 'Context';
import { Role } from '../../constants/interfaces';
interface MessagePanelProps {}

const MessagePanel = (props: MessagePanelProps) => {
  const { t } = useTranslation();
  const [count, setCount] = useState<number>(5);
  const [rerender, setRerender] = useState<boolean>(false);
  const authState = useAuthState();

  const [msgsJson, setMsgJson] = useState<Json[]>([]);
  const dbApiForMessageBoard = '/api/message-board/';

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
  }, [count, rerender]);

  const toggleRerender = async () => {
    setRerender(!rerender);
    console.log('Rerendering....');
  };

  return (
    <>
      <div className="my-3 p-3 bg-body rounded shadow-sm">
        {/* Add message */}
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
        {msgsJson.map((msgJson, index) => {
          if (index < count) {
            return <MessageDisplay key={index} msgJson={msgJson} notifyChange={toggleRerender} />;
          } else {
            return null;
          }
        })}

        {/* Expand/shrink buttons */}
        <div className="d-sm-flex jutify-content-end">
          <div className="ml-auto d-sm-flex">
            <button
              className="btn btn-md btn-outline-secondary"
              onClick={() => count <= msgsJson.length && setCount(count + 5)}
            >
              {t('messageBoardMore')}
            </button>

            <button
              className="btn btn-md btn-outline-secondary"
              onClick={() => count > 0 && setCount(count - 5)}
            >
              {t('messageBoardLess')}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MessagePanel;
