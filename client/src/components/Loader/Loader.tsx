import React from 'react';

import { ElementStyleProps } from 'constants/interfaces';

import './styles.css';

interface LoaderProps extends ElementStyleProps {

};

const Loader = (props : LoaderProps) => {
  return (
    <div className="loader-container loader" {...props.classes}>
      <h3 className="loader-content">Loading..</h3>
    </div>
  );
};

export default Loader;
