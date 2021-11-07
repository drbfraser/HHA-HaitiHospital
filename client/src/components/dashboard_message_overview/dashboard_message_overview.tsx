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
             <div className="my-3 p-3 bg-body rounded shadow-sm">
                 <h5 className="pb-2 mb-3">Message Board</h5>

                 <div className="d-flex border-bottom pb-2 mb-0 row">
                     <h6 className="text-secondary col-md-2">Title</h6>
                     <h6 className="text-secondary col-md-2">User</h6>
                     <h6 className="text-secondary col-md-2">Date</h6>
                     <h6 className="text-secondary col">Message</h6>
                 </div>

                 <tbody className="d-flex text-muted">
                     <div className="pb-3 mb-0 lh-sm w-100">{
                         (message.map((message, index) => {
                                 // Displaying top 3 messages
                                 if (index <= 2) {
                                     return(
                                         <tr key={index} className="d-flex mt-3 row border-bottom">
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
                                                 {message.messageBody.slice(0, 33)}...
                                             </p>
                                         </tr>
                                     )
                                 }
                             })
                         )}
                     </div>
                 </tbody>

                 <small className="d-block text-end mt-1">
                    <NavLink to="/messageBoard">See More</NavLink>
                 </small>
             </div>
         </div>
     )
}

export default DashboardMessageOverview;