import HHALogoSvg from '../img/logo/LogoWText.svg';
import {IProps} from './IProps'

interface IHHALogo extends IProps{
}

const HHALogo = (props: IHHALogo) => {

  return (
    <img className={props.classes} src={HHALogoSvg} 
      alt='HHA Logo' 
      style={props.style}></img>
  )
}

export default HHALogo;