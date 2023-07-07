import { Link } from 'react-router-dom';

interface NotFoundProps {}

const NotFound = (props: NotFoundProps) => {
  return (
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
};

export default NotFound;
