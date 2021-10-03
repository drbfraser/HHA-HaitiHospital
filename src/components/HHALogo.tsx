import HHALogoSvg from '../img/logo/LogoWText.svg';
import {IProps, getClassesFromProps} 
  from './IProps'

interface IHHALogo extends IProps{
  width: string;
}

const HHALogo = (props: IHHALogo) => {
  const classes = getClassesFromProps(props);

  return (
    <img className={classes} src={HHALogoSvg} 
      alt='HHA Logo' width={props.width}></img>
  )
}

export default HHALogo;