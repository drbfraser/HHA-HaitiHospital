import {IProps} from './IProps'

interface ITextHolder extends IProps {
  text: string;
}

const TextHolder = (props: ITextHolder) => {

  return(
    <div className={props.classes}
      style={props.style}
    >
      {props.text}
    </div>
  )
}

export default TextHolder;