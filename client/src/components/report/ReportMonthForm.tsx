import { Dispatch, SetStateAction } from 'react';

interface ReportMonthFormProps {
  monthLabel: string;
  reportMonth: Date;
  setReportMonth: Dispatch<SetStateAction<Date>>;
}

const ReportMonthForm = ({
  monthLabel,
  reportMonth,
  setReportMonth,
}: ReportMonthFormProps): JSX.Element => {
  return (
    <div className="col-md-6 mb-2">
      <fieldset>
        <label htmlFor="Report-Month" className="mt-2">
          {monthLabel}
        </label>
        <input
          type="month"
          className="form-control"
          id="Report-Month"
          onChange={(e) => setReportMonth(new Date(e.target.value))}
          value={reportMonth?.toISOString().slice(0, 7)}
        />
      </fieldset>
    </div>
  );
};

export default ReportMonthForm;
