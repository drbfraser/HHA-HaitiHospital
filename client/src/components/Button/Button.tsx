import {IProps} from './IProps';

interface IBtn extends IProps {
  value: string;  
}

import '/components/Button/styles.ccs'
const Btn = (props: IBtn) => {
  
  return (
    <button className={props.classes}
      style={props.style}
    >
      {props.value}
    </button>
  )
}

export default Btn;