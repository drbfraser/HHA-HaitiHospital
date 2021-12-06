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

    function replaceDotProperty(text: string) {
        text = text.replaceAll("(DOT)", ".");
        return text;
    }

    return (
        <div>
            {props.parentKey === "" ?
                <div>
                    <div className="col-sm-10 strong font-weight-bold">
                        {replaceDotProperty(props.entryKey)}
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
                        {replaceDotProperty(props.entryKey)}
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
    );
}

