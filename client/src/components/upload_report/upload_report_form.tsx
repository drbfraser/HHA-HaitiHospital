import React, { useState } from 'react';

export const UploadForm = (): JSX.Element => {
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(String(event.target.result));
        setFormData(data);
        setError(null);
      } catch (e) {
        setFormData(null);
        setError('Error parsing JSON data. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);

    // Clear the file input value as if the user selects the same file again, browser does not fire onChange event
    event.target.value = '';
  };

  return (
    <div>
    

      <br />

      <label htmlFor="file">Upload JSON Form:</label>
      <input id="file" type="file" accept=".json" onChange={handleFileChange} />

      <br />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {formData && (
        <div>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};
