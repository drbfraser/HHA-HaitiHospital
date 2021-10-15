import React from 'react';

import ElementStyleProps from 'components/IProps/IProps';

import './styles.css';

interface ILoader extends ElementStyleProps {

};

const Loader = (props : ILoader) => {
  return (
    <div className="loader-container loader" {...props}>
      <h3 className="loader-content">Loading..</h3>
    </div>
  );
};

export default Loader;
