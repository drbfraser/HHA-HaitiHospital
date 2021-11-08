import { useEffect } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import { useState } from 'react';

import { MessageProps } from 'constants/interfaces';
import Axios from 'axios';
import { NavLink} from "react-router-dom";
import './dashboard_message_overview.css'

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

    return(
         <div className={'dashboard-message-overview '+ (props.classes||'')}>
             <div className="my-3 p-3 bg-body rounded shadow-sm container-fluid">

                 <h5 className="pb-2 mb-3">Message Board</h5>

                 <table className="container-fluid">
                     <tr>
                         <thead className="d-flex border-bottom pb-2 mb-0 row">
                             <th className="text-secondary col col-sm col-md col-lg">Title</th>
                             <th className="text-secondary col col-md col-sm col-lg">User</th>
                             <th className="text-secondary col col-md col-sm col-lg">Date</th>
                             <th className="text-secondary col-6 col-md-6 col-sm-6 col-lg-6">Message</th>
                         </thead>
                     </tr>

                     <tbody className="d-flex text-muted">
                         <tr className="pb-3 mb-0 lh-sm w-100">{
                             (message.map((message, index) => {
                                     // Displaying top 3 messages
                                     if (index <= 2) {
                                         return(
                                             <td key={index} className="d-flex mt-3 row border-bottom">
                                                 <td className="text-dark col-md-2">
                                                     {message.messageHeader}
                                                 </td>
                                                 <td className="text-dark col-md-2">
                                                     {message.authorId}
                                                 </td>
                                                 <td className="text-dark col-md-2">
                                                     {message.date}
                                                 </td>
                                                 <p className="flex-column text-dark small col break-text">
                                                     {/*show first 70 character of message only*/}
                                                     {message.messageBody.slice(0, 70)}...
                                                 </p>
                                             </td>
                                         )
                                     }
                                 })
                             )}
                         </tr>
                     </tbody>

                     <small className="d-block text-end mt-1">
                         <NavLink to="/messageBoard">See More</NavLink>
                     </small>

                 </table>
             </div>
         </div>
     )
}

export default DashboardMessageOverview;