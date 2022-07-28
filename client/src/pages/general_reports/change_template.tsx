import { useState } from 'react';
import { RouteComponentProps, Link } from 'react-router-dom';
// import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import Api from 'actions/Api';
import './general_reports_styles.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { ENDPOINT_TEMPLATE_PUT } from 'constants/endpoints';
import { TOAST_TEMPLATE_PUT } from 'constants/toast_messages';

interface ChangeTemplateProps extends RouteComponentProps {}

export const ChangeTemplate = (props: ChangeTemplateProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState<File>(null);
  // const onImageUpload = (item: File) => {
  //   setSelectedFile(item);
  // };

  const handleSubmit = async () => {
    let formData : FormData = new FormData();
    formData.append('file', selectedFile);

    // alert("stuff")
    await Api.Put(
      ENDPOINT_TEMPLATE_PUT,
      formData,
      onSubmitActions,
      TOAST_TEMPLATE_PUT,
      props.history,
    );
  };

  const onSubmitActions = () => {
    toast.success('Template successfully updated!');
    setSelectedFile(null);
    props.history.push('/change-template');
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
        <form onSubmit={handleSubmit}>
          <div className={`form-group col-md-6`}>
            <label className="form-label">{t('Upload New Template')}</label>
            <input
              type="file"
              accept=".json"
              className="form-control"
              id="customFile"
              required
              onChange={(e) => setSelectedFile(e.target.files[0])}
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
