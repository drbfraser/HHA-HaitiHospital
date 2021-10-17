import React from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps } from 'constants/interfaces';
import Layout from 'layout/Layout';

import './styles.css';

interface NotFoundProps extends ElementStyleProps {

};

const NotFound = (props: NotFoundProps) => {
  return (
    <Layout>
      <div className="not-found">
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
