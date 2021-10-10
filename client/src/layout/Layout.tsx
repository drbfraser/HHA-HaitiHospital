import React from 'react';

import IProps from 'components/IProps/IProps';

import 'components/layout/styles.css';

interface ILayout extends IProps {
  children: any,
};

const Layout = ({ children }: ILayout) => {
  return (
    <div></div>
  );
}

export default Layout;

// Comment out during JS to TS, for future reference
// import React from 'react';
// import PropTypes from 'prop-types';

// import Navbar from '../components/Navbar/Navbar';
// import Footer from '../components/Footer/Footer';
// import './styles.css';

// const Layout = ({ children }) => {
//   return (
//     <>
//       <Navbar />
//       <div className="container">{children}</div>
//       <Footer />
//     </>
//   );
// };

// Layout.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export default Layout;
