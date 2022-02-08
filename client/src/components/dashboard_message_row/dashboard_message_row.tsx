import { Link } from 'react-router-dom';
import { MESSAGE_BOARD_MAIN_ROUTE } from 'constants/routing';

interface MessageOverviewProps {
    messageID: number;
    messageContent: string;
    creator: string;
    lastUpdatedOn: string;
    priority: string;
}

const MessageOverviewRow = (props: MessageOverviewProps) => {
    return (
        <tr className={'message-overview-row'}>
            <td>
                <Link to={MESSAGE_BOARD_MAIN_ROUTE +props.messageID}>
                    {props.messageID}
                </Link>
            </td>
            <td> {props.messageContent} </td>
            <td> {props.creator} </td>
            <td> {props.lastUpdatedOn} </td>
            <td> {props.priority} </td>

            {/*<td><Button value='edit'/></td>*/}
            {/*<td><Button value='del'/></td>*/}
            {/*<td><TextHolder text='tick'/></td>*/}
        </tr>
    );
};

export default MessageOverviewRow;
