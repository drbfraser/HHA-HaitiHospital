import React from 'react';
import { NavLink } from "react-router-dom";

import { ElementStyleProps } from 'constants/interfaces';
import TextHolder from 'components/text-holder/text_holder';
// import Button from 'components/Button/Button';

import './styles.css';

interface MessageBoardProps extends ElementStyleProps {}

const MessageBoard = (props: MessageBoardProps,) => {
  return (
    <div className={'message-board '+props.classes}>
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