import { Dispatch, SetStateAction } from 'react';

import { DepartmentJson as Department } from '@hha/common';
import { MonthField } from 'components/form/MonthField';
import { useTranslation } from 'react-i18next';

interface ReportAndTemplateFormProps {
  departmentLabel: string;
  monthLabel: string;
  departments: Department[];
  currentDepartment: Department | undefined;
  setCurrentDepartment: Dispatch<SetStateAction<Department | undefined>>;
  reportMonth: Date | undefined;
  setReportMonth: Dispatch<SetStateAction<Date | undefined>>;
}

export const ReportAndTemplateForm = ({
  departmentLabel,
  monthLabel,
  departments,
  currentDepartment,
  setCurrentDepartment,
  reportMonth,
  setReportMonth,
}: ReportAndTemplateFormProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="col-md-6 mb-2 mt-3 p-3">
      <fieldset>
        <label htmlFor="Report-Department-Type">{departmentLabel}</label>
        <select
          className="form-select"
          id="Report-Department-Type"
          onChange={(e) =>
            setCurrentDepartment(departments.find(({ id }) => e.target.value === id))
          }
          value={currentDepartment?.id || ''}
          required
        >
          <option value="">{t('headerReportChooseDepartment')}</option>
          {departments &&
            departments.map(({ id, name }) => (
              <option key={id} value={id}>
                {t(`departments.${name}`)}
              </option>
            ))}
        </select>
        <MonthField setReportMonth={setReportMonth} />
      </fieldset>
    </div>
  );
};
