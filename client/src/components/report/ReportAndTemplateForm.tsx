import { Dispatch, SetStateAction } from 'react';

import { Department } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';

interface ReportAndTemplateFormProps {
  departmentLabel: string;
  departments: any;
  currentDepartment: Department;
  setCurrentDepartment: Dispatch<SetStateAction<Department>>;
}

export const ReportAndTemplateForm = ({
  departmentLabel,
  departments,
  currentDepartment,
  setCurrentDepartment,
}: ReportAndTemplateFormProps): JSX.Element => {
  const { t } = useTranslation();
  console.log('ReportAndTemplateForm', departments);

  return (
    <div className="col-md-6 mb-2">
      <fieldset>
        <label htmlFor="">{departmentLabel}</label>
        <select
          className="form-control"
          id="Report-Department-Type"
          onChange={(e) =>
            setCurrentDepartment(departments.find(({ id }) => e.target.value === id))
          }
          value={currentDepartment?.id || ''}
        >
          <option value="">{t('headerReportChooseDepartment')}</option>
          {departments &&
            departments.map(({ id, name }) => (
              <option key={id} value={id}>
                {t(`departments.${name}`)}
              </option>
            ))}
        </select>
      </fieldset>
    </div>
  );
};
