import { useState } from 'react';
import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { BiomechModel, bioMechEnum } from './BiomechModel';
import Api from '../../actions/Api';
import { ENDPOINT_BIOMECH_POST } from 'constants/endpoints';
import { TOAST_BIOMECH_POST } from 'constants/toast_messages';
import './broken_kit_report.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { History } from 'history';
import { imageCompressor } from 'utils/imageCompressor';

interface BrokenKitReportProps extends RouteComponentProps {}

export const BrokenKitReport = (props: BrokenKitReportProps) => {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);
  const { register, handleSubmit, reset } = useForm<BiomechModel>({});
  const history: History = useHistory<History>();

  const onImageUpload = (item: File) => {
    setSelectedFile(item);
  };

  const onSubmitActions = () => {
    toast.success('Biomechanic report successfully submitted!');
    reset({});
    setSelectedFile(null);
    props.history.push('/biomechanic');
  };

  const onSubmit = async (data: any) => {
    let formData = new FormData();
    let postData = JSON.stringify(data);
    formData.append('document', postData);
    formData.append('file', selectedFile);
    await Api.Post(ENDPOINT_BIOMECH_POST, formData, onSubmitActions, TOAST_BIOMECH_POST, history);
  };

  return (
    <div className="broken_kit">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to="/biomechanic">
            <button type="button" className="btn btn-outline-dark">
              {t('brokenKitReportBack')}
            </button>
          </Link>
        </div>
        <div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group col-md-6">
              <label className="font-weight-bold">{t('brokenKitReportBrokenKitReport')}</label>
              <div>
                <label htmlFor="Equipment Name" className="form-label">
                  {t('brokenKitReportNameOfEquipment')}
                </label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Equipment Name"
                  required
                  {...register('equipmentName', { required: true })}
                ></input>
                <label htmlFor="Equipment Fault" className="form-label">
                  {t('brokenKitReportFaultWithEquipment')}
                </label>
                <textarea
                  className="form-control mb-2 mt-0"
                  id="Equipment Fault"
                  required
                  {...register('equipmentFault', { required: true })}
                ></textarea>
                <label htmlFor="Equipment Priority" className="form-label">
                  {t('brokenKitReportPriorityOfEquipment')}
                </label>
                <select
                  className="form-select"
                  id="Equipment Priority"
                  aria-label="Default select example"
                  required
                  {...register('equipmentPriority', { required: true })}
                  defaultValue=""
                >
                  <option value="">{t('brokenKitReportClickToSelectPriority')}</option>
                  <option value={bioMechEnum.Urgent}>{t('brokenKitReportUrgent')}</option>
                  <option value={bioMechEnum.Important}>{t('brokenKitReportImportant')}</option>
                  <option value={bioMechEnum.NonUrgent}>{t('brokenKitReportNonUrgent')}</option>
                </select>
                <label htmlFor="customFile" className="form-label mt-2">
                  {t('brokenKitReportUploadImage')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="customFile"
                  required
                  onChange={(e) => imageCompressor(e.target.files[0], onImageUpload)}
                />
              </div>
              <div>
                <button className="btn btn-primary mt-4 " type="submit">
                  {t('brokenKitReportSubmitForm')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
