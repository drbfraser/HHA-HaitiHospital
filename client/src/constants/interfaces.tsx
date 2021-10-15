import {CSSProperties} from 'react';
export interface CustomCssProps extends CSSProperties {
  '--grid-cols'? : string,
  '--griditem-alignself'? :string,
  '--griditem-justifyself'?: string,
};
export interface ElementStyleProps {
    classes?: string;
    style?: CustomCssProps;
};


export interface ReportSummary {
    id: number,
    lastUpdatedOn: Date,
    lastUpdatedByUserId: number,
};


export interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray,
}
export interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }


// export interface ReportEntry {
//   (x : string) : string | number | boolean | Date | Report | Report[],
// }
type Entry = string | number | boolean | Date | ReportProps | ReportProps[];
export interface ReportProps {
  [index : string] :  Entry,
}

