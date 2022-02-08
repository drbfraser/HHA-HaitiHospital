// import 'components/layout/home_styles.css';
import './layout_styles.css';

interface LayoutProps {
  children: any,
};

const Layout = (props: LayoutProps) => {
  return (
    <div className={'layou'}></div>
  );
}

export default Layout;

// Comment out during JS to TS, for future reference
// import React from 'react';
// import PropTypes from 'prop-types';

// import Navbar from '../components/Navbar/Navbar';
// import Footer from '../components/Footer/Footer';
// import './home_styles.css';

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
