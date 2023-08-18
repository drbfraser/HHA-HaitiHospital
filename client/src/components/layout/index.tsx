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
  additionalButtons?: React.ReactNode;
}

const Layout = ({
  className,
  children,
  style,
  showBackButton = false,
  additionalButtons = null,
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

          <div className="p-3">
            <div className="d-flex gap-2">
              {showBackButton && (
                <button
                  className="btn btn-md btn-outline-secondary mb-3"
                  data-testid="back-button"
                  onClick={history.goBack}
                >
                  {t('button.back')}
                </button>
              )}
              {additionalButtons}
            </div>
            {children}
          </div>
        </div>
      </main>
    </>
  );
};

export default Layout;
