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
    const [ message, setMessage ] = useState([
        {
            "messageHeader": 1,
            "authorId": "123",
            "date": "11-02-2011",
            "messageBody": "Becoming cloudy this afternoon with 40 percent chance of showers later this afternoon. Wind southwest 20 km/h gusting to 40 becoming southeast 20 this afternoon. Temperature steady near 10. UV index 1 or low.",
        },
        {
            "messageHeader": 2222,
            "authorId": "12345",
            "date": "09-02-2011",
            "messageBody": "Cloudy with 70 percent chance of showers. High 10.",
        },
        {
            "messageHeader": 333333,
            "authorId": "12345678",
            "date": "08-02-2011",
            "messageBody": "Mainly cloudy. 60 percent chance of showers in the morning. A few showers beginning in the morning. Wind southeast 20 km/h except gusting to 40 near the Strait of Georgia in the morning. Temperature steady near 7.",
        },
        {
            "messageHeader": 2222,
            "authorId": "34567",
            "date": "11-11-1111",
            "messageBody": "Mainly cloudy with 60 percent chance of showers. Wind southeast 20 km/h. Low 6.",
        },

    ]);

    useEffect(() => {
        const messagesFromServer = fetchMessages();
        messagesFromServer.then(val => {
            setMessage(val.data);
        })
    }, [])

    return(
         <div className={'dashboard-message-overview '+ (props.classes||'')}>
             <div className="my-3 p-3 bg-body rounded shadow-sm container-fluid">
                 <table className="container-fluid">

                     <h5 className="pb-2 mb-3">Message Board</h5>

                     <thead className="d-flex border-bottom pb-2 mb-0 row">
                     <h6 className="text-secondary col col-sm col-md col-lg">Title</h6>
                     <h6 className="text-secondary col col-md col-sm col-lg">User</h6>
                     <h6 className="text-secondary col col-md col-sm col-lg">Date</h6>
                     <h6 className="text-secondary col-6 col-md-6 col-sm-6 col-lg-6">Message</h6>
                     </thead>

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
                                                 {/*show first 70 character of message only*/}
                                                 {message.messageBody.slice(0, 70)}...
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

                 </table>
             </div>
         </div>
     )
}

export default DashboardMessageOverview;