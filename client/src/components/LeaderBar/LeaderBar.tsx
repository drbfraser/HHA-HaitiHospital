import React from 'react';

import IProps from 'components/IProps/IProps';
import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
import ICustomCSS from 'components/ICustomCSS/ICustomCSS';

import './styles.css'

interface ILeaderBar extends IProps {
}

const LeaderBar = (props: ILeaderBar) => {
  
  return(
    <div className={props.classes}
      style={props.style}
    >
      <Button classes='btn grid-item goto-leaderboard-btn'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself':'center',
        } as ICustomCSS} 
        value='LEADERS BOARD'
      />
      <TextHolder classes='grid-item department-leader'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself': ' center',
        } as ICustomCSS}
        text='NICU/PAED'
      />
      <TextHolder classes='grid-item department-leader-point'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself' : 'center',
<<<<<<< HEAD:client/src/components/LeaderBar/LeaderBar.tsx
        } as ICustomCSS}
        text='position 1 score 99'/>
=======
        } as MyCustomCSS}
        text='Position 1 Score 99'/>
>>>>>>> 8d9f73d2a79f93bfc40b54db3967b8bc7a38af59:frontend/src/components/LeaderBar.tsx
    </div>
  )
}

export default LeaderBar;