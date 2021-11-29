import React, {SyntheticEvent, useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

import { ElementStyleProps} from 'constants/interfaces';
import {TickList, TickObserver} from 'components/department_reports/report_summary_table/tick_list'
import temp_checklist from '../temp_checklist';
import {useTranslation} from "react-i18next";

interface ReportSummaryProps extends ElementStyleProps {
  reportId: string;
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
      <th scope='row'>
        <Link to={`/Department1NICU/detailed_report/view/${props.reportId}`}>
          { props.reportId }
        </Link>
      </th>
      <td>{ props.lastUpdatedOn.toDateString() }</td>
      <td>{ props.lastUpdatedBy }</td>
      <td>
        <Link to={`/Department1NICU/detailed_report/edit/${props.reportId}`}>
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