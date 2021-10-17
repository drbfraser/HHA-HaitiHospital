import React from 'react';

import { ElementStyleProps, CustomCssProps } from 'constants/interfaces';
import Button from 'components/button/button';
import TextHolder from 'components/text-holder/text_holder';

import './styles.css'

interface LeaderBarProps extends ElementStyleProps {
}

const LeaderBar = (props: LeaderBarProps) => {
  
  return(
    <div className={'leader-bar ' + (props.classes || '')}
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