import ReadonlyReportForm from 'components/report/ReadonlyReportForm';
import SubmitButton from 'components/report/SubmitButton';
import React, { FormEvent, Dispatch, SetStateAction, useState } from 'react';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { useTranslation } from 'react-i18next';

export const UploadForm = ({
  formHandler,
  isSubmitting,
  reportTemplateData,
  updateReport,
}: {
  formHandler: (event: FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportTemplateData: QuestionGroup<ID, ErrorType> | null;
  updateReport: Dispatch<SetStateAction<QuestionGroup<string, string> | null>>;
}): JSX.Element => {
  const { t } = useTranslation();
  const [error, setError] = useState<string | null>(null);
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) {
      console.error('No file added');
      return;
    }
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        if (!event.target || !event.target.result) {
          throw Error('Error no file result');
        }
        const data = JSON.parse(String(event.target.result));
        updateReport(objectSerializer.deserialize(data.reportObject));
        setError(null);
      } catch (e) {
        updateReport(null);
        setError('Error parsing JSON data. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);
  };

  return (
    <div className="col-md-6">
      <form onSubmit={formHandler} noValidate>
        <div className="mb-3">
          <label htmlFor="file" className="form-label">
            {t('template.upload_template')}:
          </label>
          <input
            id="file"
            type="file"
            accept=".json"
            className="form-control"
            onChange={handleFileChange}
            onClick={(event) => {
              event.currentTarget.value = '';
              updateReport(null);
              setError(null);
            }}
          />
        </div>

        {error && (
          <p style={{ color: 'red' }} className="mb-3">
            {error}
          </p>
        )}

        <div className="mb-3">
          <SubmitButton
            buttonText="Submit Report Template"
            disabled={!reportTemplateData || isSubmitting}
            readOnly={false}
          />
        </div>

        {reportTemplateData && (
          <ReadonlyReportForm isSubmitting={false} reportData={reportTemplateData} isTemplate />
        )}
      </form>
    </div>
  );
};
