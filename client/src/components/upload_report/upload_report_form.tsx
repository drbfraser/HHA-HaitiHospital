import React, { useState, Dispatch, SetStateAction } from 'react';
import { ObjectSerializer, QuestionGroup } from '@hha/common';

import Api from 'actions/Api';

export const UploadForm = ({
  applyReportChanges,
  formHandler,
  isSubmitting,
  reportTemplateData,
  updateReport,
}: {
  applyReportChanges: () => void;
  formHandler: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportTemplateData: QuestionGroup<ID, ErrorType>;
  updateReport: Dispatch<SetStateAction<QuestionGroup<string, string>>>;
}): JSX.Element => {
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
    <div className="mt-3 p-3">
      <form onSubmit={formHandler} noValidate>
        <br />

        <label htmlFor="file">Upload JSON Form:</label>
        <input id="file" type="file" accept=".json" onChange={handleFileChange} />

        {error && <p style={{ color: 'red' }}>{error}</p>}

        {buildSubmitButton()}
        {reportTemplateData && (
          <>
            <div>
              <pre>{JSON.stringify(reportTemplateData, null, 2)}</pre>
            </div>
            {buildSubmitButton()}
          </>
        )}
      </form>
    </div>
  );
};
