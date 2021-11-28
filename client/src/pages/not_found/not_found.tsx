import React from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps } from 'constants/interfaces';
import Layout from 'layout/layout';

import './not_found_styles.css';

interface NotFoundProps extends ElementStyleProps {}

const NotFound = (props: NotFoundProps) => {
  return (
      <div className={"not-found "+(props.classes ||'')}>
        <h1>Not Found 404</h1>
        <p>
          Go back to{' '}
          <Link className="bold" to="/">
            Home
          </Link>
        </p>
      </div>
  );
};

export default NotFound;
