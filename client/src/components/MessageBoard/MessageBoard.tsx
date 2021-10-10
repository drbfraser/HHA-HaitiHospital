<<<<<<< HEAD:client/src/components/MessageBoard/MessageBoard.tsx
import React from 'react';

import IProps from 'components/IProps/IProps';
import TextHolder from 'components/TextHolder/TextHolder';
import Button from 'components/Button/Button';

import './styles.css';
=======
import {IProps} from './IProps';
import TextHolder from './TextHolder';
import Btn from './Btn';
import { Link, NavLink, RouteComponentProps } from "react-router-dom";
>>>>>>> 8d9f73d2a79f93bfc40b54db3967b8bc7a38af59:frontend/src/components/MessageBoard.tsx

interface IMessageBoard extends IProps {}

const MessageBoard: React.FC<IProps> = (props: IMessageBoard,) => {
  return (
    <div className={props.classes}>
<<<<<<< HEAD:client/src/components/MessageBoard/MessageBoard.tsx
      {/*<TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>*/}
        <div>Message Board</div>
        <Button classes='msg-seemore' value='See more'/>
      <TextHolder classes='msg' text='Message 1'/>   
      <TextHolder classes='msg' text='Message 2'/>   
      <TextHolder classes='msg' text='Message 3'/>

=======
          <TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>
            {/*<Btn classes='msg-seemore' value='See more'/>*/}
          <TextHolder classes='msg' text='Message 1 Message 1 Message 1 Message 1 Message 1 Message 1 '/>
          <TextHolder classes='msg' text='Message 2 Message 2 Message 2 Message 2 Message 2 Message 2'/>
          <TextHolder classes='msg' text='Message 3 Message 3 Message 3 Message 3 Message 3 Message 3'/>
        <NavLink className="msg-seemore" to="/MessageBoardMain" exact>
            See More
        </NavLink>
>>>>>>> 8d9f73d2a79f93bfc40b54db3967b8bc7a38af59:frontend/src/components/MessageBoard.tsx
    </div> 
  )
}

export default MessageBoard;