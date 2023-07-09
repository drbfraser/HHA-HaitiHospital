import './dashboard_message_overview.css';

import { language, timezone } from 'constants/timezones';

import Api from 'actions/Api';
import { ENDPOINT_MESSAGEBOARD_GET } from 'constants/endpoints';
import { History } from 'history';
import { Message } from 'constants/interfaces';
import { NavLink } from 'react-router-dom';
import { TOAST_MESSAGEBOARD_GET_ERROR } from 'constants/toastErrorMessages';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface DashboardMessageProps {}

const DashboardMessageOverview = (props: DashboardMessageProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const history: History = useHistory<History>();

  useEffect(() => {
    const controller = new AbortController();
    const getMessages = async () => {
      setMessages(
        await Api.Get(
          ENDPOINT_MESSAGEBOARD_GET,
          TOAST_MESSAGEBOARD_GET_ERROR,
          history,
          controller.signal,
        ),
      );
    };

    getMessages();
    return () => {
      setMessages([]);
      controller.abort();
    };
  }, [history]);

  const { t } = useTranslation();

  return (
    <div className={'dashboard-message-overview'}>
      <div className="my-3 p-2 bg-body rounded shadow-sm">
        <h5 className="mb-3">{t('dashboardMessageOverviewMessages')}</h5>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">{t('dashboardMessageOverviewTitle')}</th>
                <th scope="col">{t('dashboardMessageOverviewUser')}</th>
                <th scope="col">{t('dashboardMessageOverviewDate')}</th>
                <th scope="col">{t('dashboardMessageOverviewMessage')}</th>
              </tr>
            </thead>

            <tbody className="text-muted">
              {messages.map((message: Message, index: number) => {
                if (index <= 2) {
                  return (
                    <tr key={index}>
                      <th scope="row" className="text-secondary text-break">
                        {message.messageHeader}
                      </th>
                      <td className="text-secondary">
                        {!!message.user ? message.user.name : t('status.not_available')}
                      </td>
                      <td className="text-secondary">
                        {message.date.toLocaleString(language, {
                          timeZone: timezone,
                        })}
                      </td>
                      <td className="text-secondary text-break">
                        {/*show first 70 character of message only*/}
                        {message.messageBody.length > 70
                          ? message.messageBody.slice(0, 70) + '...'
                          : message.messageBody}
                      </td>
                    </tr>
                  );
                } else {
                  return null;
                }
              })}
            </tbody>
          </table>
        </div>

        <div className="d-flex justify-content-end">
          <NavLink to="/message-board">
            <button
              data-testid="see-more-messages-button"
              type="button"
              className="btn btn-secondary btn-block col-auto"
            >
              {t('dashboardMessageOverviewSeeMore')}
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default DashboardMessageOverview;
