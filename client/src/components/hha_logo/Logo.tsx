import HHALogo from 'img/logo/Logo.svg';
import HHALogoSvg from 'img/logo/LogoWText.svg';
import { Link } from 'react-router-dom';

interface LogoProps {
  style?: React.CSSProperties;
  className?: string;
  isExpanded?: boolean;
}

const Logo = ({ style = {}, className = '', isExpanded = false }: LogoProps) => {
  return (
    <Link to="/home">
      <img
        className={className}
        src={isExpanded ? HHALogoSvg : HHALogo}
        alt="HHA Logo"
        style={style}
      />
    </Link>
  );
};

export default Logo;
