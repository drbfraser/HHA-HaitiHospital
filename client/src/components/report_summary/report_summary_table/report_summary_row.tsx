import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps, getDepartmentName} from 'constants/interfaces';
import {TickList, TickObserver} from 'components/report_summary/report_summary_table/tick_list'
import {useTranslation} from "react-i18next";

interface ReportSummaryProps extends ElementStyleProps {
  reportId: string;
  deptId: number;
  lastUpdatedOn: Date;
  lastUpdatedBy: string;
  isTicked: boolean;
  notifyTable (update : {[rid : string] : boolean}): void;
}

const ReportSummaryRow = (props: ReportSummaryProps) => {

  const [isTicked, setTicked] = useState<boolean>(props.isTicked);

  useEffect(() => {
    setTicked(props.isTicked);
  }, [props.isTicked]);

  const {t, i18n} = useTranslation();

  return (
    <tr id={`rp-sum-row-${props.reportId}`}>
      <td>
        <Link to={`/department/${props.deptId}/view/${props.reportId}`}>
          { props.reportId }
        </Link>
      </td>
      <td>
          {getDepartmentName(props.deptId)}
      </td>
      <td>{ props.lastUpdatedOn.toDateString() }</td>
      <td>{ props.lastUpdatedBy }</td>
      <td>
        <Link to={`/department/${props.deptId}/edit/${props.reportId}`}>
          <button className="btn btn-small btn-primary">{t("departmentPageEdit")}</button>
        </Link>
      </td>
      <td>
        <div className="form-check">
          <input className="form-check-input"
            type="checkbox"
            value={props.reportId}
            id={`tick-${props.reportId}`}
            checked = {isTicked}

            onChange = {(e: SyntheticEvent) => {
                const target = e.target as HTMLInputElement;
                let update = {};
                update[props.reportId] = target.checked;
                props.notifyTable(update);
            }}
          />

          <label className="form-check-label" htmlFor={`tick-${props.reportId}`}>
          </label>
        </div>
      </td>
    </tr>
  )
}

export default ReportSummaryRow;