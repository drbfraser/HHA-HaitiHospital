import {IProps} from './IProps';
import TextHolder from './TextHolder';
// import Btn from './Btn';
import { Link, NavLink, RouteComponentProps } from "react-router-dom";

interface IMessageBoard extends IProps {
}

const MessageBoard: React.FC<IProps> = (props: IMessageBoard) => {

  return (
    <div className={props.classes}>
      <TextHolder classes='msgboard-title' text='MESSAGE BOARD'/>
        {/*<Btn classes='msg-seemore' value='See more'/>*/}
        {/*<button className="Departmentbutton2"*/}
        {/*        onClick={() => {*/}
        {/*            history.push("/Department2Maternity");*/}
        {/*        }}>MATERNITY</button>*/}
      <TextHolder classes='msg' text='Message 1'/>   
      <TextHolder classes='msg' text='Message 2'/>   
      <TextHolder classes='msg' text='Message 3'/>
    </div> 
  )
}

export default MessageBoard;