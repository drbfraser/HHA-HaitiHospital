import Layout from 'components/layout';
import { Link } from 'react-router-dom';

const NotAuthorized = () => (
  <Layout>
    <div className="text-center">
      <h1>Not Authorized 401</h1>
      <p>
        Go back to{' '}
        <Link className="bold" to="/">
          Login
        </Link>
      </p>
    </div>
  </Layout>
);

export default NotAuthorized;
