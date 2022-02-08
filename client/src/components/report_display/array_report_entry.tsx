import { ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report_display/report_display';

interface ArrayEntryProps {
  name: string;
  entryKey: string;
  parentKey: string;
  descriptions: Object;
  entries: ReportProps[];
  edit: boolean;
}

export const ArrayEntry = (props: ArrayEntryProps) => {
  function concatParent(entryKey: string) {
    if (props.parentKey === '') {
      return entryKey;
    } else {
      return props.parentKey + '_' + entryKey;
    }
  }

  return (
    <div className="entry simple-entry row my-2 text-dark ps-5">
      {props.name}
      <>
        {props.entries.map((entry) => (
          <div className="">
            {'\t'}
            <ReportDisplay
              report={entry as ReportProps}
              parentKey={concatParent(props.entryKey)}
              descriptions={props.descriptions}
              edit={props.edit}
            />
          </div>
        ))}
      </>
    </div>
  );
};
