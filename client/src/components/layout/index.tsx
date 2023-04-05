import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';

const Layout = ({ children }) => (
  <>
    <SideBar />
    <main className="container-fluid main-region">
      <Header />
      {children}
    </main>
  </>
);
export default Layout;
