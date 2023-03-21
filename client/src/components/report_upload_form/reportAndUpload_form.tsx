import { Dispatch, SetStateAction } from 'react';
import { Department } from 'constants/interfaces';

export const ReportAndTemplateForm = ({
  title,
  departmentLabel,
  departments,
  currentDepartment,
  setCurrentDepartment,
}: {
  title: string;
  departmentLabel: string;
  departments: any;
  currentDepartment: Department;
  setCurrentDepartment: Dispatch<SetStateAction<Department>>;
}): JSX.Element => {
  return (
    <div className="col-md-6 mb-2">
      <h1 className="text-start">{title}</h1>
      <fieldset>
        <label htmlFor="">{departmentLabel}</label>
        <select
          className="form-control"
          id="Report-Department-Type"
          onChange={(e) =>
            setCurrentDepartment(departments.find(({ id, name }) => e.target.value === id))
          }
          value={currentDepartment?.id || ''}
        >
          <option value="">Choose a department</option>
          {departments &&
            departments.map(({ id, name }) => (
              <option key={id} value={id}>
                {name}
              </option>
            ))}
        </select>
      </fieldset>
    </div>
  );
};
