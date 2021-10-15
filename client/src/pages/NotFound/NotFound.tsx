import React from 'react';
import { Link } from 'react-router-dom';

import ElementStyleProps from 'components/IProps/IProps';
import Layout from 'layout/Layout';

import './styles.css';

interface INotFound extends ElementStyleProps {

};

const NotFound: React.FC<INotFound> = () => {
  return (
    <Layout>
      <div className="not-found-page">
        <h1>Not Found 404</h1>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
    </Layout>
  );
};

export default NotFound;
