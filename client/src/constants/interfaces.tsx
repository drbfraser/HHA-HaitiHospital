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

export interface Json {
    [x: string]: string|number|boolean|Date|Json|JsonArray,
}
export interface JsonArray extends Array<string|number|boolean|Date|Json|JsonArray> { }

type ReportEntry = string | number | boolean | ReportProps | ReportProps[];
export interface ReportProps {
  [index : string] :  ReportEntry,
}
