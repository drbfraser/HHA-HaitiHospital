import {IProps} from './IProps';
import TextHolder from './TextHolder';
import Btn from './Btn';
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

interface IMessageBoard extends IProps {}

const MessageBoard: React.FC<IProps> = (props: IMessageBoard,) => {
  return (
    <div className={props.classes}>
          <TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>
            {/*<Btn classes='msg-seemore' value='See more'/>*/}
          <TextHolder classes='msg' text='Message 1 Message 1 Message 1 Message 1 Message 1 Message 1 '/>
          <TextHolder classes='msg' text='Message 2 Message 2 Message 2 Message 2 Message 2 Message 2'/>
          <TextHolder classes='msg' text='Message 3 Message 3 Message 3 Message 3 Message 3 Message 3'/>
        <NavLink className="msg-seemore" to="/MessageBoardMain" exact>
            See More
        </NavLink>
    </div> 
  )
}

export default MessageBoard;