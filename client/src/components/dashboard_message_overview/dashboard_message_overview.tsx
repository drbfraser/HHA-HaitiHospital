import { useEffect } from 'react';
import { Json } from 'constants/interfaces';
import { useState } from 'react';

import Axios from 'axios';
import { NavLink } from 'react-router-dom';
import './dashboard_message_overview.css';
import { useTranslation } from 'react-i18next';

interface DashboardMessageProps {
}


const DashboardMessageOverview = (props: DashboardMessageProps) => {
  const [messages, setMessage] = useState([]);

  useEffect(() => {
    const fetchMessages = async () => {
        let messages = await Axios.get('/api/message-board');
        return messages;
    };
      
    const messagesFromServer = fetchMessages();
    messagesFromServer.then((val) => {
      setMessage(val.data);
    });
  }, []);

    const {t} = useTranslation();

    return(
        <div className={'dashboard-message-overview'}>
            <div className="my-3 p-2 bg-body rounded shadow-sm">
                <h5 className="mb-3">{t("dashboardMessageOverviewMessages")}</h5>

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
                    {messages.map((message, index) => {
                        // Displaying top 3 messages

                        let fullName = (message.userId as Json).name;

                        if (index <= 2) {
                            return(
                                <tr key={index}>
                                    <th scope="row" className="text-secondary text-break">{message.messageHeader}</th>
                                    <td className="text-secondary">
                                        {fullName}
                                    </td>
                                    <td className="text-secondary">
                                        {(new Date(message.date)).toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })}
                                    </td>
                                    <td className="text-secondary text-break">
                                        {/*show first 70 character of message only*/}
                                        {message.messageBody.length > 70 ? message.messageBody.slice(0, 70) + "..." : message.messageBody}
                                    </td>
                                </tr>
                            )
                        }
                        else {
                            return null;
                        }
                    })
                    }
                </tbody>
            </table>
        </div>

        <div className="d-flex justify-content-end">
          <NavLink to="/message-board">
            <button type="button" className="btn btn-secondary btn-block col-auto">
              {t('dashboardMessageOverviewSeeMore')}
            </button>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default DashboardMessageOverview;
