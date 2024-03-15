import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportMonthFormProps {
  monthLabel: string;
  reportMonth: Date;
  applyMonthChanges: (reportMonth: Date) => void;
  formHandler: (event: React.FormEvent<HTMLFormElement>, isDraft: Boolean) => void;
}

const ReportMonthForm = ({
  monthLabel,
  reportMonth,
  applyMonthChanges,
  formHandler,
}: ReportMonthFormProps): JSX.Element => {
  const [currentReportMonth, setCurrentReportMonth] = useState<Date>(reportMonth);
  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    applyMonthChanges(currentReportMonth);
    formHandler(event, false);
  };

  return (
    <div className="col-md-6 mb-2">
      <form onSubmit={handleSubmit}>
        <label htmlFor="Report-Month" className="mt-2">
          {monthLabel}
        </label>
        <input
          type="month"
          className="form-control"
          id="Report-Month"
          onChange={(e) => setCurrentReportMonth(new Date(e.target.value))}
          value={currentReportMonth?.toISOString().slice(0, 7)}
          max={new Date().toISOString().slice(0, 7)}
        />
        <button type="submit" className="btn btn-primary mt-2">
          {t('departmentReportDisplayMonthApplyChanges')}
        </button>
      </form>
    </div>
  );
};

export default ReportMonthForm;
