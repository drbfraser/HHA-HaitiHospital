import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className={'text-center'}>
    <h1>Not Found 404</h1>
    <p>
      Go back to{' '}
      <Link className="bold" to="/home">
        Home
      </Link>
    </p>
  </div>
);

export default NotFound;
