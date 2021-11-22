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
                     <thead>
                         <tr className="d-flex border-bottom pb-2 mb-0 row">
                             <th className="text-secondary col col-sm col-md-2 col-lg-2">Title</th>
                             <th className="text-secondary col col-sm col-md-2 col-lg-2">User</th>
                             <th className="text-secondary col col-sm col-md-3 col-lg-3">Date</th>
                             <th className="text-secondary col-6 col-sm-6 col-md col-lg">Message</th>
                         </tr>
                     </thead>

                     <tbody className="d-flex text-muted">
                         <tr className="pb-3 mb-0 lh-sm w-100">{
                             (message.map((message, index) => {
                                     // Displaying top 3 messages
                                     if (index <= 2) {
                                         return(
                                             <td key={index} className="d-flex mt-3 row border-bottom">
                                                 <p className="text-dark col-md-2 text-break">
                                                     {message.messageHeader}
                                                 </p>
                                                 <p className="text-dark col-md-2">
                                                     {message.authorId}
                                                 </p>
                                                 <p className="text-dark col-md-3">
                                                     {message.date}
                                                 </p>
                                                 <p className="flex-column text-dark small col text-break">
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

                 </table>
                 <small className="d-block text-end mt-1">
                         <NavLink to="/messageBoard">See More</NavLink>
                     </small>
             </div>
         </div>
     )
}

export default DashboardMessageOverview;