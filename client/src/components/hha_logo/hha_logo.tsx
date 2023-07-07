import HHALogoSvg from 'img/logo/LogoWText.svg';
import { Link } from 'react-router-dom';

interface HhaLogoProps {
  style: React.CSSProperties;
}

const HhaLogo = (props: HhaLogoProps) => {
  return (
    <Link to="/home">
      <img className={'hha-logo'} src={HHALogoSvg} alt="HHA Logo" style={props.style}></img>
    </Link>
  );
};

export default HhaLogo;
