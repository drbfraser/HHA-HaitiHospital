import React, { useState, Dispatch, SetStateAction } from 'react';
import { ObjectSerializer, QuestionGroup } from '@hha/common';
import { useTranslation } from 'react-i18next';

export const UploadForm = ({
  formHandler,
  isSubmitting,
  reportTemplateData,
  updateReport,
}: {
  formHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportTemplateData: QuestionGroup<ID, ErrorType>;
  updateReport: Dispatch<SetStateAction<QuestionGroup<string, string>>>;
}): JSX.Element => {
  const { t } = useTranslation();
  const [error, setError] = useState(null);
  const objectSerializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();

  const buildSubmitButton = () => {
    return (
      <>
        <input
          className="btn btn-outline-primary"
          disabled={!reportTemplateData || isSubmitting}
          type="submit"
          value="Submit Report Template"
        />
      </>
    );
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(String(event.target.result));
        updateReport(objectSerializer.deserialize(data.reportObject));
        setError(null);
      } catch (e) {
        updateReport(null);
        setError('Error parsing JSON data. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);

    // Clear the file input value as if the user selects the same file again, browser does not fire onChange event
    event.target.value = '';
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
          />
        </div>

        {error && (
          <p style={{ color: 'red' }} className="mb-3">
            {error}
          </p>
        )}

        <div className="mb-3">{buildSubmitButton()}</div>

        {reportTemplateData && (
          <div className="mb-3">
            <div>
              <pre>{JSON.stringify(reportTemplateData, null, 2)}</pre>
            </div>
            <div className="mb-3">{buildSubmitButton()}</div>
          </div>
        )}
      </form>
    </div>
  );
};
