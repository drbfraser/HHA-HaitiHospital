import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import cn from 'classnames';

const Layout = ({
  className,
  children,
  style,
}: {
  className?: string;
  children: any;
  style?: any;
}) => (
  <>
    <SideBar />
    <main className={cn('container-fluid main-region', className)} style={style}>
      <Header />
      {children}
    </main>
  </>
);
export default Layout;
