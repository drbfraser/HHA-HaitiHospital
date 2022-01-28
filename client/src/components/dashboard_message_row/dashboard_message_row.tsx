import React from 'react';
import { Link } from 'react-router-dom';
import { ElementStyleProps } from 'constants/interfaces';
import { MESSAGE_BOARD_MAIN_ROUTE } from 'constants/routing';
// import Button from 'components/button/button';
// import TextHolder from 'components/text_holder/text_holder';

interface MessageOverviewProps extends ElementStyleProps {
  messageID: number;
  messageContent: string;
  creator: string;
  lastUpdatedOn: string;
  priority: string;
}

const MessageOverviewRow = (props: MessageOverviewProps) => {
  return (
    <tr className={'message-overview-row ' + (props.classes || '')}>
      <td>
        <Link to={MESSAGE_BOARD_MAIN_ROUTE + props.messageID}>{props.messageID}</Link>
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
