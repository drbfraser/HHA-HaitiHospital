import React from 'react';

import IProps from 'components/IProps/IProps';

import './styles.css';

interface ILoader extends IProps {

};

const Loader = (props : ILoader) => {
  return (
    <div className="loader-container loader" {...props}>
      <h3 className="loader-content">Loading..</h3>
    </div>
  );
};

export default Loader;
