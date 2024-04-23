import { History } from 'history';
import { MessageJson } from '@hha/common';
import { NavLink } from 'react-router-dom';
import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { toI18nDateString } from 'constants/date';
import { getAllMessageBoards } from 'api/messageBoard';

const DashboardMessageOverview = () => {
  const [messages, setMessages] = useState<MessageJson[]>([]);
  const history: History = useHistory<History>();
  const { t, i18n } = useTranslation();

  const fetchMessages = useCallback(async () => {
    const messages = await getAllMessageBoards(history);
    setMessages(messages);
  }, [history]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

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
              {messages.map((message: MessageJson, index: number) => {
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
                        {toI18nDateString(message.date, i18n.resolvedLanguage)}
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
