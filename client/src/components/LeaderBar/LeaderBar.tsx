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
        } as ICustomCSS}
        text='Position 1 Score 99'/>
    </div>
  )
}

export default LeaderBar;