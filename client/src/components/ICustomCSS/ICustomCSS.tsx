import {CSSProperties} from 'react';

interface ICustomCSS extends CSSProperties {
  '--grid-cols'? : string,
  '--griditem-alignself'? :string,
  '--griditem-justifyself'?: string,
}

export default ICustomCSS;