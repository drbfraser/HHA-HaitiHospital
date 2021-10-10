import IProps from 'components/IProps/IProps';
import TextHolder from 'components/TextHolder/TextHolder';
import Button from 'components/Button/Button';

import 'components/MessageBoard/styles.css';

interface IMessageBoard extends IProps {
}

const MessageBoard = (props: IMessageBoard) => {

  return (
    <div className={props.classes}>
      {/*<TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>*/}
        <div>Message Board</div>
        <Button classes='msg-seemore' value='See more'/>
      <TextHolder classes='msg' text='Message 1'/>   
      <TextHolder classes='msg' text='Message 2'/>   
      <TextHolder classes='msg' text='Message 3'/>

    </div> 
  )
}

export default MessageBoard;