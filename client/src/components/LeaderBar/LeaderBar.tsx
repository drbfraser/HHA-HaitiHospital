import React from 'react';

import ElementStyleProps from 'components/IProps/IProps';
import Button from 'components/Button/Button';
import TextHolder from 'components/TextHolder/TextHolder';
import CustomCssProps from 'components/ICustomCSS/ICustomCSS';

import './styles.css'

interface ILeaderBar extends ElementStyleProps {
}

const LeaderBar = (props: ILeaderBar) => {
  
  return(
    <div className={props.classes}
      style={props.style}
    >
      <Button classes='btn grid-item goto-leaderboard-btn'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself':'center',
        } as CustomCssProps} 
        value='LEADERS BOARD'
      />
      <TextHolder classes='grid-item department-leader'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself': ' center',
        } as CustomCssProps}
        text='NICU/PAED'
      />
      <TextHolder classes='grid-item department-leader-point'
        style={{'--griditem-alignself':'center',
          '--griditem-justifyself' : 'center',
        } as CustomCssProps}
        text='Position 1 Score 99'/>
    </div>
  )
}

export default LeaderBar;