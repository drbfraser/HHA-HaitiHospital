import React from 'react';

import { ElementStyleProps } from 'constants/interfaces';

import './styles.css';
import Header from 'components/header/header';

interface AdminProps extends ElementStyleProps {

};

const Admin = (props : AdminProps) => {
  return(
    <div className={'admin '+ (props.classes||'')}>
      <Header/>
    </div>
  );
}

export default Admin;

// Comment out during Js to Ts for future reference
// import React from 'react';
// import { Link } from 'react-router-dom';

// import requireAdmin from 'hoc/requireAdmin';
// import Layout from 'layout/Layout';
// import 'pages/Admin/homeStyles.css';

// type Props = {

// }

// const Admin = ({}: Props) => {
//   return (
//     <Layout>
//       <div className="admin-page">
//         <h1>Admin dashboard</h1>
//         <p>
//           This is the Admin page. Only the Admin can access this page. Return back to{' '}
//           <Link className="bold" to="/">
//             Home
//           </Link>
//         </p>
//       </div>
//     </Layout>
//   );
// };

// export default requireAdmin(Admin);
