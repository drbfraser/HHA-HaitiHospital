import {IProps} from './IProps';
import TextHolder from './TextHolder';
import Btn from './Btn';

interface IMessageBoard extends IProps {
}

const MessageBoard = (props: IMessageBoard) => {

  return (
    <div className={props.classes}> 
      <TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>
      <TextHolder classes='msg' text='Message 1'/>   
      <TextHolder classes='msg' text='Message 2'/>   
      <TextHolder classes='msg' text='Message 3'/>
      <Btn classes='msg-seemore' value='See more'/>
    </div> 
  )
}

export default MessageBoard;