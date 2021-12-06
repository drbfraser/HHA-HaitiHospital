import React from 'react';
import { ElementStyleProps, ReportProps } from 'constants/interfaces';
import { ReportDisplay } from 'components/report_display/report_display';
import TextHolder from 'components/text_holder/text_holder';

interface TableEntryProps extends ElementStyleProps {
    name: string;
    entryKey: string;
    parentKey: string;
    value: ReportProps;
    edit: boolean;
}
;

export const TableEntry = (props: TableEntryProps) => {

    function concatParent(entryKey: string) {
        if (props.parentKey === "") {
            return entryKey;
        } else {
            return props.parentKey + "_" + entryKey;
        }
    }

    return (
        <div>
            {props.parentKey === "" ?
                <div>
                    <div className="col-sm-10 strong font-weight-bold">
                        {props.entryKey}
                    </div>
                    <div>
                        <>{'\t'}
                            <ReportDisplay report={props.value}
                                parentKey={concatParent(props.entryKey)}
                                descriptions=""
                                edit={props.edit} />
                        </>

                    </div>
                </div>
                :
                <div>
                    <div className="col-sm-10 strong font-weight-bold ps-5">
                        {props.entryKey}
                    </div>
                    <div>
                        <>{'\t'}
                            <ReportDisplay report={props.value}
                                parentKey={concatParent(props.entryKey)}
                                descriptions=""
                                edit={props.edit} />
                        </>

                    </div>
                </div>
        }


        </div>
        // <div className={`entry object-entry accordion my-2 ${props.classes || ''}`}
        //   id={`object_entry_${props.name}`}>
        //   <div className="accordion-item">
        //     <div className="accordion-header h3-small">
        //       <button 
        //         className="accordion-button" 
        //         type='button'
        //         data-bs-toggle='collapse'
        //         data-bs-target={`#collapse_${props.name}`}
        //         >
        //         { props.name }
        //       </button>
        //     </div>
        //     <div className="accordion-collapse collapse"
        //       id={`collapse_${props.name}`}
        //       data-bs-parent={`#object_entry_${props.name}`}
        //     >
        //       <div className="accordion-body text-dark h4-small">
        //         <>{
        //           <>{'\t'}
        //           <ReportDisplay report={props.value}
        //             parentKey={concatParent(props.entryKey)}
        //             descriptions={props.descriptions}
        //             edit={props.edit}/>
        //           </>
        //         }</>
        //       </div>
        //     </div>
        //   </div>
        // </div>
    );
}

