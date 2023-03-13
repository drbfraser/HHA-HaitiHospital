import React, { useState } from 'react';

export const UploadForm = (): JSX.Element => {
  const departments = ['HR', 'Marketing', 'Sales', 'IT'];

  const [department, setDepartment] = useState('');
  const [formData, setFormData] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false);
  const [error, setError] = useState(null);

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = JSON.parse(String(event.target.result));
        setFormData(data);
        setFileUploaded(true);
        setError(null);
      } catch (e) {
        setError('Error parsing JSON data. Please upload a valid JSON file.');
      }
    };

    reader.readAsText(file);
  };
  const handleClear = () => {
    setFormData(null);
    setFileUploaded(false);
    setError(null);
  };


  return (
    <div>
      <label htmlFor="department">Select Department:</label>
      <select id="department" value={department} onChange={handleDepartmentChange}>
        <option value="">--Select Department--</option>
        {departments.map((dept) => (
          <option key={dept} value={dept}>{dept}</option>
        ))}
      </select>

      <br />

      <label htmlFor="file">Upload JSON Form:</label>
      <input id="file" type="file" accept=".json" onChange={handleFileChange} />

      <br />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {formData && fileUploaded && (
        <div>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
          <button onClick={handleClear}>Clear</button>
        </div>
      )}
    </div>
  );
};
