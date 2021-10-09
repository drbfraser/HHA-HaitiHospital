import {CSSProperties} from 'react';

export interface ICustomCSS extends CSSProperties {
  '--grid-cols'? : string,
  '--griditem-alignself'? :string,
  '--griditem-justifyself'?: string,
}