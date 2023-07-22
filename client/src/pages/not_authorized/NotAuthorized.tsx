import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <div className="text-center">
    <h1>Not Authorized 401</h1>
    <p>
      Go back to{' '}
      <Link className="bold" to="/home">
        Home
      </Link>
    </p>
  </div>
);

export default NotAuthorized;
