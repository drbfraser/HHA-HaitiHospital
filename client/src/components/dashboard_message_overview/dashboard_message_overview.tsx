import { useEffect } from 'react';
import { ElementStyleProps } from 'constants/interfaces';
import { useState } from 'react';

import { MessageProps } from 'constants/interfaces';
import Axios from 'axios';

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

    return (
        <table className={'dashboard-message-overview '+ (props.classes || '')}>
            <thead>
                <tr>
                    <th>MessageTitle</th>
                    <th>User</th>
                    <th>Date</th>
                    <th>Message</th>
                </tr>
            </thead>
            <tbody>{
                (message.map((message, index) => {
                    // Displaying top 3 messages
                    if (index <= 2) {
                        return(
                            <tr key={index}>
                                <td>
                                    {message.messageHeader}
                                </td>
                                <td>
                                    {message.authorId}
                                </td>
                                <td>
                                    {message.date}
                                </td>
                                <td>
                                    {message.messageBody}
                                </td>
                            </tr>
                        )
                    }
                }) 
                )}
            </tbody>
        </table>
    )
}

export default DashboardMessageOverview;