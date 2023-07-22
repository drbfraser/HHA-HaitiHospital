import HHALogoSvg from 'img/logo/LogoWText.svg';
import { Link } from 'react-router-dom';

interface LogoProps {
  style: React.CSSProperties;
}

const Logo = (props: LogoProps) => {
  return (
    <Link to="/home">
      <img className={'hha-logo'} src={HHALogoSvg} alt="HHA Logo" style={props.style}></img>
    </Link>
  );
};

export default Logo;
