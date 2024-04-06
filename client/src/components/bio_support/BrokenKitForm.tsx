import { BIOMECH_REPORT_FIELDS, BiomechForm } from 'pages/biomech/typing';
import { BiomechPriority, BiomechStatus } from '@hha/common';
import { FormControl, FormSelect } from 'react-bootstrap';
import { getEntriesFromEnum, imageCompressor } from 'utils';

import { ChangeEvent } from 'react';
import { Form } from 'components/form/Form';
import { FormField } from 'components/form/FormField';
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
    <Form onSubmit={handleSubmit(onSubmit)} className="col-md-6">
      <FormField htmlFor="Equipment Name" label={t('biomech.report.equipment_name')} required>
        <FormControl
          className="mb-2 mt-0"
          id="Equipment Name"
          required
          defaultValue={biomechForm?.equipmentName}
          {...register(BIOMECH_REPORT_FIELDS.equipmentName)}
        />
      </FormField>

      <FormField htmlFor="Equipment Fault" label={t('biomech.report.issue')} required>
        <FormControl
          as="textarea"
          className="mb-2 mt-0"
          id="Equipment Fault"
          defaultValue={biomechForm?.equipmentFault}
          required
          rows={5}
          {...register(BIOMECH_REPORT_FIELDS.equipmentFault)}
        ></FormControl>
      </FormField>

      <FormField htmlFor="Equipment Priority" label={t('biomech.report.priority')} required>
        <FormSelect
          id="Equipment Priority"
          aria-label="Default select example"
          required
          defaultValue={biomechForm?.equipmentPriority}
          {...register(BIOMECH_REPORT_FIELDS.equipmentPriority)}
        >
          {!biomechForm && <option value="">{t('biomech.report.inquiry_priority')}</option>}
          {getEntriesFromEnum(BiomechPriority).map(({ value }) => (
            <option key={value} value={value}>
              {t(`biomech.priority.${value}`)}
            </option>
          ))}
        </FormSelect>
      </FormField>

      <FormField htmlFor="Equipment Status" label={t('biomech.report.status')} required>
        <FormSelect
          required
          id="Equipment Status"
          aria-label="Default select example"
          defaultValue={biomechForm?.equipmentStatus}
          {...register(BIOMECH_REPORT_FIELDS.equipmentStatus)}
        >
          {!biomechForm && <option value="">{t('biomech.report.inquiry_status')}</option>}
          {getEntriesFromEnum(BiomechStatus).map(({ value }) => (
            <option key={value} value={value}>
              {t(`biomech.status.${value}`)}
            </option>
          ))}
        </FormSelect>
      </FormField>

      <FormField htmlFor="customFile" label={t('button.add_image')} required={!biomechForm}>
        <FormControl
          type="file"
          as="input"
          accept="image/png,image/jpeg,image/jpg"
          id="customFileBioMech"
          required={!biomechForm}
          multiple={false}
          {...(register(BIOMECH_REPORT_FIELDS.file),
          {
            onChange: (e: ChangeEvent<HTMLInputElement>) => {
              if (e.target.files && e.target.files.length > 0) {
                const file = e.target.files[0];

                imageCompressor(
                  file,
                  (compressedImage) => setValue(BIOMECH_REPORT_FIELDS.file, compressedImage),
                  (error) => toast.error(error.message),
                );
              }
            },
          })}
        />
      </FormField>
    </Form>
  );
};

export default BrokenKitForm;
