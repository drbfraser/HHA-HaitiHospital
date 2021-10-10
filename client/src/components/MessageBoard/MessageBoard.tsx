import React from 'react';
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

import IProps from 'components/IProps/IProps';
import TextHolder from 'components/TextHolder/TextHolder';
import Button from 'components/Button/Button';

import './styles.css';

interface IMessageBoard extends IProps {}

const MessageBoard: React.FC<IProps> = (props: IMessageBoard,) => {
  return (
    <div className={props.classes}>
      <TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>
        {/*<Btn classes='msg-seemore' value='See more'/>*/}
      <TextHolder classes='msg' text='Message 1 Message 1 Message 1 Message 1 Message 1 Message 1 '/>
      <TextHolder classes='msg' text='Message 2 Message 2 Message 2 Message 2 Message 2 Message 2'/>
      <TextHolder classes='msg' text='Message 3 Message 3 Message 3 Message 3 Message 3 Message 3'/>
      <NavLink className="msg-seemore" to="/messageBoard" exact>
          See More
      </NavLink>
    </div> 
  )
}

export default MessageBoard;