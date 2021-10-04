import {IProps} from './IProps';
import Btn from './Btn';
import TextHolder from './TextHolder';
import { MyCustomCSS } from './MyCustomCSS';

interface ILeaderBar extends IProps {
}

const LeaderBar = (props: ILeaderBar) => {

  return(
    <div className={props.classes}
      style={props.style}
    >
      <Btn classes='btn grid-item goto-leaderboard-btn'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself':'center',
        } as MyCustomCSS} 
        value='LEADERS BOARD'
      />
      <TextHolder classes='grid-item'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself': ' center',
        } as MyCustomCSS}
        text='NICU/PAED'
      />
      <TextHolder classes='grid-item'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself' : 'center',
        } as MyCustomCSS}
        text='position 1 score 99'/>
    </div>
  )
}

export default LeaderBar;