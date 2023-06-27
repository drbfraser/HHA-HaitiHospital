import { Link } from 'react-router-dom';

import './not_authorized_styles.css';

interface NotAuthProps {}

const NotAuthorized = (props: NotAuthProps) => {
  return (
    <div className={'not-authorized-page'}>
      <h1>Not Authorized 401</h1>
      <p>
        Please{' '}
        <Link className="bold" to="/">
          Login
        </Link>
      </p>
    </div>
  );
};

export default NotAuthorized;
