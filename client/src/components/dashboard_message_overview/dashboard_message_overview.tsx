import { useEffect } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import { useState } from 'react';

import { MessageProps } from 'constants/interfaces';
import Axios from 'axios';
import { NavLink} from "react-router-dom";
import './dashboard_message_overview.css'
import {useTranslation} from "react-i18next";

interface DashboardMessageProps extends ElementStyleProps {
    messages :MessageProps[],
}

const fetchMessages = (async () => {
    let messages = await Axios.get("/api/messageboard");
    return messages;
})

const DashboardMessageOverview = (props : DashboardMessageProps) => {
    const [ message, setMessage ] = useState([]);

    useEffect(() => {
        const messagesFromServer = fetchMessages();
        messagesFromServer.then(val => {
            setMessage(val.data);
        })
    }, [])

    const {t, i18n} = useTranslation();

    return(
         <div className={'dashboard-message-overview '+ (props.classes||'')}>

             <h5 className="pb-2 mt-5 mb-1">{t("dashboardMessageOverviewMessages")}</h5>

             <table className="table caption-top">
                 {/*<caption className="pb-2 mb-3">{t("dashboardMessageOverviewMessages")}</caption>*/}

                 <thead>
                     <tr>
                         <th scope="col">{t("dashboardMessageOverviewTitle")}</th>
                         <th scope="col">{t("dashboardMessageOverviewUser")}</th>
                         <th scope="col">{t("dashboardMessageOverviewDate")}</th>
                         <th scope="col">{t("dashboardMessageOverviewMessage")}</th>
                     </tr>
                 </thead>

                 <tbody className="text-muted">
                     {(message.map((message, index) => {
                         // Displaying top 3 messages
                         if (index <= 2) {
                             return(
                                 <tr>
                                     <th scope="row" className="text-secondary text-break" key={index}>{message.messageHeader}</th>
                                     <td className="text-secondary">
                                         {message.authorId}
                                     </td>
                                     <td className="text-secondary">
                                         {message.date}
                                     </td>
                                     <td className="text-secondary text-break">
                                         {/*show first 70 character of message only*/}
                                         {message.messageBody.slice(0, 70)}...
                                     </td>
                                 </tr>
                                )
                            }
                         })
                     )}
                 </tbody>
             </table>

             <NavLink className="btn btn-outline-secondary" to="/messageBoard">{t("dashboardMessageOverviewSeeMore")}</NavLink>
             {/*<small className="justify-content-end">*/}
             {/*    <NavLink to="/messageBoard">{t("dashboardMessageOverviewSeeMore")}</NavLink>*/}
             {/*</small>*/}
             </div>
     )
}

export default DashboardMessageOverview;