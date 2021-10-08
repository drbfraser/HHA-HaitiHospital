import {CSSProperties} from 'react';

export interface MyCustomCSS extends CSSProperties {
  '--grid-cols'? : string,
  '--griditem-alignself'? :string,
  '--griditem-justifyself'?: string,
}