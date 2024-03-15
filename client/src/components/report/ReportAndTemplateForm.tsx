import { Dispatch, SetStateAction } from 'react';

import { Department } from 'constants/interfaces';
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
    <div className="col-md-6 mb-2">
      <fieldset>
        <label htmlFor="Report-Department-Type">{departmentLabel}</label>
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
        <label htmlFor="Report-Month" className="mt-2">
          {monthLabel}
        </label>
        <input
          type="month"
          className="form-control"
          id="Report-Month"
          onChange={(e) => setReportMonth(new Date(e.target.value))}
          value={reportMonth?.toISOString().slice(0, 7)}
          max={new Date().toISOString().slice(0, 7)}
        />
      </fieldset>
    </div>
  );
};
