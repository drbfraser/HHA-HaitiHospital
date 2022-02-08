import { ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report_display/report_display';

interface ObjectEntryProps  {
  name: string;
  entryKey: string;
  parentKey: string;
  descriptions: Object;
  value: ReportProps;
  edit: boolean;
}
export const ObjectEntry = (props: ObjectEntryProps) => {
  function concatParent(entryKey: string) {
    if (props.parentKey === '') {
      return entryKey;
    } else {
      return props.parentKey + '_' + entryKey;
    }
  }

  return (
    <div>
      <>
        {
          <>
            {'\t'}
            <ReportDisplay
              report={props.value}
              parentKey={concatParent(props.entryKey)}
              descriptions={props.descriptions}
              edit={props.edit}
            />
          </>
        }
      </>
    </div>
  );
};
