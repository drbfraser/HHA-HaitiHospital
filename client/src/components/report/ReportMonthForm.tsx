import { MonthField } from 'components/form/MonthField';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ReportMonthFormProps {
  reportMonth: Date | undefined;
  applyMonthChanges: (reportMonth: Date) => void;
  formHandler: (event: React.FormEvent<HTMLFormElement>, isDraft: boolean) => void;
}

const ReportMonthForm = ({
  reportMonth,
  applyMonthChanges,
  formHandler,
}: ReportMonthFormProps): JSX.Element => {
  const [currentReportMonth, setCurrentReportMonth] = useState<Date | undefined>(reportMonth);
  const { t } = useTranslation();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (currentReportMonth) {
      applyMonthChanges(currentReportMonth);
    }
    formHandler(event, false);
  };

  return (
    <div className="col-md-6 mb-2">
      <form onSubmit={handleSubmit}>
        <MonthField
          setReportMonth={setCurrentReportMonth}
          previousReportMonth={currentReportMonth}
        />
        <button type="submit" className="btn btn-primary mt-2">
          {t('departmentReportDisplayMonthApplyChanges')}
        </button>
      </form>
    </div>
  );
};

export default ReportMonthForm;
