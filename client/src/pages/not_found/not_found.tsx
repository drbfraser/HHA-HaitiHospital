import { Link } from 'react-router-dom';

import './not_found_styles.css';

interface NotFoundProps {}

const NotFound = (props: NotFoundProps) => {
  return (
    <div className={'not-found-page'}>
      <h1>Not Found 404</h1>
      <p>
        Go back to{' '}
        <Link className="bold" to="/home">
          Home
        </Link>
      </p>
    </div>
  );
};

export default NotFound;
