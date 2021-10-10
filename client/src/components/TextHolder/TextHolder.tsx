import IProps from 'components/IProps/IProps';

import 'components/TextHolder/TextHolder';

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