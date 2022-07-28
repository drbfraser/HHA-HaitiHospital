import { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import './general_reports_styles.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { imageCompressor } from 'utils/imageCompressor';

interface ChangeTemplateProps extends RouteComponentProps {}

export const ChangeTemplate = (props: ChangeTemplateProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  return (
    <div className={'general-reports'}>
      <SideBar />

      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/general-reports">
            <button type="button" className="btn btn-outline-dark">
              {t('Back')}
            </button>
          </Link>
        </div>
        <form>
          <div className={`form-group col-md-6`}>
            <label className="form-label">{t('Upload New Template')}</label>
            <input
              type="file"
              accept=".json"
              className="form-control"
              id="customFile"
              required
              onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
            />
            <div className="mt-3 mb-5">
              <button className="btn btn-primary" type="submit">
                {t('Submit Template')}
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};
