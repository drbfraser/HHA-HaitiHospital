import { SyntheticEvent, useState } from 'react';
import { Link } from 'react-router-dom';

import { getDepartmentName } from 'common/definitions/departments';
import { useTranslation } from 'react-i18next';
import { makeDateShort } from 'utils/dateFormatting';

interface ReportSummaryProps {
  reportId: string;
  createdOn: string;
  deptId: number;
  lastUpdatedOn: Date;
  lastUpdatedBy: string;
  isTicked: boolean;
  notifyTable(update: { [rid: string]: boolean }): void;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {
  const [isTicked] = useState<boolean>(props.isTicked);
  const { t } = useTranslation();

  return (
    <tr id={`rp-sum-row-${props.reportId}`}>
      <td>
        <Link to={`/department/${props.deptId}/view/${props.reportId}`}>
          {makeDateShort(props.createdOn)}
        </Link>
      </td>
      <td>{getDepartmentName(props.deptId)}</td>
      <td>{props.lastUpdatedOn.toDateString()}</td>
      <td>{props.lastUpdatedBy}</td>
      <td>
        <Link to={`/department/${props.deptId}/edit/${props.reportId}`}>
          <button className="btn btn-small btn-primary">{t('departmentPageEdit')}</button>
        </Link>
      </td>
      <td>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            id={`tick-${props.reportId}`}
            checked={isTicked}
            onChange={(e: SyntheticEvent) => {
              const target = e.target as HTMLInputElement;
              let update = {};
              update[props.reportId] = target.checked;
              props.notifyTable(update);
            }}
          />

          <label className="form-check-label" htmlFor={`tick-${props.reportId}`}></label>
        </div>
      </td>
    </tr>
  );
};

export default ReportSummaryRow;
