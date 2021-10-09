import React from 'react';

import 'components/Loader/styles.css';

type Props = {

};

const Loader = (props : Props) => {
  return (
    <div className="loader-container loader" {...props}>
      <h3 className="loader-content">Loading..</h3>
    </div>
  );
};

export default Loader;
