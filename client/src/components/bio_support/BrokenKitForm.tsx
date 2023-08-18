import {
  BIOMECH_REPORT_FIELDS,
  BiomechForm,
  BiomechPriority,
  BiomechStatus,
} from 'pages/biomech/typing';

import { imageCompressor } from 'utils';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface BrokenKitFormProps {
  onSubmit: (data: BiomechForm) => void;
  biomechForm?: BiomechForm;
}

const BrokenKitForm = ({ onSubmit, biomechForm }: BrokenKitFormProps) => {
  const { t } = useTranslation();
  const { register, handleSubmit, setValue } = useForm<BiomechForm>({});

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="form-group col-md-6">
        <label htmlFor="Equipment Name" className="form-label">
          {t('biomech.report.equipment_name')}
        </label>
        <input
          className="form-control mb-2 mt-0"
          type="text"
          id="Equipment Name"
          required
          defaultValue={biomechForm?.equipmentName}
          {...register(BIOMECH_REPORT_FIELDS.equipmentName)}
        ></input>

        <label htmlFor="Equipment Fault" className="form-label">
          {t('biomech.report.issue')}
        </label>
        <textarea
          className="form-control mb-2 mt-0"
          id="Equipment Fault"
          defaultValue={biomechForm?.equipmentFault}
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
          defaultValue={biomechForm?.equipmentPriority}
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

        <label htmlFor="Equipment Status" className="form-label">
          {t('biomech.report.status')}
        </label>
        <select
          required
          id="Equipment Status"
          aria-label="Default select example"
          className="form-select"
          defaultValue={biomechForm?.equipmentStatus}
          {...register(BIOMECH_REPORT_FIELDS.equipmentStatus)}
        >
          <option value="" disabled hidden>
            {t('biomech.report.inquiry_status')}
          </option>
          <option value={BiomechStatus.FIXED}>{t(`biomech.status.${BiomechStatus.FIXED}`)}</option>
          <option value={BiomechStatus.INPROGRESS}>
            {t(`biomech.status.${BiomechStatus.INPROGRESS}`)}
          </option>
          <option value={BiomechStatus.BACKLOG}>
            {t(`biomech.status.${BiomechStatus.BACKLOG}`)}
          </option>
        </select>

        <label htmlFor="customFile" className="form-label mt-2" >
          {t('button.add_image')}{biomechForm?.file === null && <>*</>}
        </label>
        <input
          type="file"
          accept="image/png,image/jpeg,image/jpg"
          className="form-control"
          id="customFileBioMech"
          required={biomechForm?.file === null}
          {...(register(BIOMECH_REPORT_FIELDS.file),
          {
            onChange: (e) => {
              if (e.target.files.length === 0) return;
              return imageCompressor(
                e.target.files.item(0),
                (result) => {
                  setValue(BIOMECH_REPORT_FIELDS.file, result);
                },
                (error) => {
                  e.target.files = null;
                  e.target.value = '';
                  setValue(BIOMECH_REPORT_FIELDS.file, '');
                  toast.error(error.message);
                },
              );
            },
          })}
        />

        <button data-testid="submit-biomech-button" className="btn btn-primary mt-4 " type="submit">
          {t('button.submit')}
        </button>
      </div>
    </form>
  );
};

export default BrokenKitForm;
