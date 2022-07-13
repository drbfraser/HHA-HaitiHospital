import { RouteComponentProps, Link, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { BiomechPriority } from './BiomechModel';
import Api from '../../actions/Api';
import { ENDPOINT_BIOMECH_POST } from 'constants/endpoints';
import './broken_kit_report.css';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { History } from 'history';
import { imageCompressor } from 'utils/imageCompressor';
import { Paths } from 'constants/paths';
import { ResponseMessage } from 'utils/response_message';
import { BiomechForm, BIOMECH_REPORT_FIELDS } from 'constants/forms';

interface BrokenKitReportProps extends RouteComponentProps {}

export const BrokenKitReport = (props: BrokenKitReportProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue } = useForm<BiomechForm>({});
  const history: History = useHistory<History>();

  const onSubmitOk = () => {
    toast.success(ResponseMessage.getMsgCreateReportOk());
    props.history.push(Paths.getBioMechMain());
  };

  const onSubmit = async (data: BiomechForm) => {
    // Parse to FormData() to support multipart/data-form form
    const formData = new FormData();
    Object.keys(data).forEach(key => formData.append(key, data[key])) 
    await Api.Post(
      ENDPOINT_BIOMECH_POST,
      formData,
      onSubmitOk,
      ResponseMessage.getMsgCreateReportFailed(),
      history,
    );
  };

  return (
    <div className="broken_kit">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="ml-3 mb-3 d-flex justify-content-start">
          <Link to={Paths.getBioMechMain()}>
            <button type="button" className="btn btn-outline-dark">
              {t('button.back')}
            </button>
          </Link>
        </div>

        <div>
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
            <div className="form-group col-md-6">
              <label className="font-weight-bold">{t('biomech.report.title')}</label>
              <div>
                <label htmlFor="Equipment Name" className="form-label">
                  {t('biomech.report.equipment_name')}
                </label>
                <input
                  className="form-control mb-2 mt-0"
                  type="text"
                  id="Equipment Name"
                  required
                  {...register(BIOMECH_REPORT_FIELDS.equipmentName)}
                ></input>
                <label htmlFor="Equipment Fault" className="form-label">
                  {t('biomech.report.issue')}
                </label>
                <textarea
                  className="form-control mb-2 mt-0"
                  id="Equipment Fault"
                  required
                  {...register(BIOMECH_REPORT_FIELDS.equipmentFault)}
                ></textarea>
                <label htmlFor="Equipment Priority" className="form-label">
                  {t('biomech.report.priority')}
                </label>
                <select
                  className="form-select"
                  id="Equipment Priority"
                  aria-label="Default select example"
                  required
                  defaultValue=""
                  {...register(BIOMECH_REPORT_FIELDS.equipmentPriority)}
                >
                  <option value="" disabled hidden>
                    {t('biomech.report.inquiry_priority')}
                  </option>
                  <option value={BiomechPriority.URGENT}>
                    {t(`biomech.priority.${BiomechPriority.URGENT}`)}
                  </option>
                  <option value={BiomechPriority.IMPORTANT}>
                    {t(`biomech.priority.${BiomechPriority.IMPORTANT}`)}
                  </option>
                  <option value={BiomechPriority.NONURGENT}>
                    {t(`biomech.priority.${BiomechPriority.NONURGENT}`)}
                  </option>
                </select>
                <label htmlFor="customFile" className="form-label mt-2">
                  {t('button.add_image')}
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  id="customFile"
                  required
                  {...(register(BIOMECH_REPORT_FIELDS.file),
                  {
                    onChange: (e) =>
                      imageCompressor(e.target.files.item(0), (result) =>
                        setValue(BIOMECH_REPORT_FIELDS.file, result)
                      )
                  })}
                />
              </div>

              <div>
                <button className="btn btn-primary mt-4 " type="submit">
                  {t('button.submit')}
                </button>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
