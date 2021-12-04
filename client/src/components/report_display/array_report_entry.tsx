import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report_display/report_display';
import TextHolder from 'components/text_holder/text_holder';

interface ArrayEntryProps extends ElementStyleProps {
  name: string;
  entryKey: string;
  parentKey: string;
  descriptions: Object;
  entries: ReportProps[];
  edit: boolean;
};

export const ArrayEntry = (props: ArrayEntryProps) => {

  function concatParent(entryKey: string) {
    if (props.parentKey === "") {
      return entryKey;
    } else {
      return props.parentKey + "_" + entryKey;
    }
  }
  console.log(props.entries);

  return (
    <div className="entry simple-entry row my-2 text-dark ps-5">
      {props.name}
      <>
        {
          props.entries.map((entry) => (
            <div className="">
              {'\t'}<ReportDisplay
                report={entry as ReportProps}
                parentKey={concatParent(props.entryKey)}
                descriptions={props.descriptions}
                edit={props.edit} />
            </div>
          )
          )
        }
      </>
    </div>

    // <div className = {'entry array-entry accordion my-2' + (props.classes || '')}
    //   id={`array_entry_${props.name}`}
    // >
    //   <div className="accordion-item">
    //     <div className="accordion-header h3-small">
    //       <button 
    //         className="accordion-button" 
    //         type='button'
    //         data-bs-toggle='collapse'
    //         data-bs-target={`#collapse_${props.name}`}
    //       >
    //         { props.name }
    //       </button>
    //     </div>

    //     <div className="accordion-collapse collapse"
    //       id={`collapse_${props.name}`}
    //       data-bs-parent={`#array_entry_${props.name}`}
    //     >
    //       <div className="accordion-body text-dark h4-small">
    //         <>
    //           {
    //             props.entries.map((entry) => (
    //               <div>
    //                 {'\t'}<ReportDisplay 
    //                   report={entry as ReportProps}
    //                   parentKey={concatParent(props.entryKey)}
    //                   descriptions = {props.descriptions}
    //                   edit={props.edit} />
    //               </div>
    //             ))
    //           }
    //         </>
    //       </div>
    //     </div>
    //   </div>

    // </div>
  );
};