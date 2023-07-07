import './index.css';

import Header from 'components/header/header';
import SideBar from 'components/side_bar/side_bar';
import cn from 'classnames';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}

const Layout = ({ className, children, style }: LayoutProps) => (
  <>
    <main className={cn('container-fluid', className)} style={style}>
      <SideBar />

      <div className="main main-region px-2">
        <Header />
        {children}
      </div>
    </main>
  </>
);
export default Layout;
