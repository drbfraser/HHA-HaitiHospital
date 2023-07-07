import './index.css';

import Header from 'components/header/Header';
import SideBar from 'components/side_bar/SideBar';
import cn from 'classnames';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface LayoutProps {
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
  showBackButton?: boolean;
  title?: string;
}

const Layout = ({
  className,
  children,
  style,
  showBackButton = false,
  title = '',
}: LayoutProps) => {
  const history = useHistory();
  const { t } = useTranslation();

  return (
    <>
      <main className={cn('container-fluid', className)} style={style}>
        <SideBar />

        <div className="main main-region px-2">
          <Header title={title} />
          {showBackButton && (
            <button className="btn btn-md btn-outline-secondary" onClick={history.goBack}>
              {t('addMessageBack')}
            </button>
          )}
          <div className="p-3">{children}</div>
        </div>
      </main>
    </>
  );
};

export default Layout;
