import React from 'react';
import { ElementStyleProps } from 'constants/interfaces';

interface SimpleEntryProps extends ElementStyleProps {
  name: string;
  entryKey: string;
  parentKey: string;
  descriptions: Object;
  value: boolean | string | number;
  edit: boolean;
}

export const SimpleEntry = (props: SimpleEntryProps) => {
  function getClassName() {
    if (props.classes === undefined) return 'entry simple-entry';
    else return `entry simple-entry ${props.classes}`;
  }

  function startsWithCapital(word) {
    return word.charAt(0) === word.charAt(0).toUpperCase();
  }

  if (props.edit === true)
    return (
      <div className={`${getClassName()} row my-2 input-group`}>
        <div className="col-sm input-group-text">
          <strong>{props.name}</strong>
        </div>
        <input
          type="text"
          className="col-sm form-control"
          placeholder={`${props.value as string}`}
        />
      </div>
    );
  else
    return (
      <div>
        {props.parentKey === '' || props.entryKey.includes('total') ? (
          <div className={`${getClassName()} row my-2 text-dark`}>
            <div className="col-sm-10 strong font-weight-bold">{`${props.name}`}</div>
            <div className="col-sm-2"> {`${props.value as string}`}</div>
          </div>
        ) : startsWithCapital(props.parentKey) ? (
          <div className={`${getClassName()} row my-2 text-dark`}>
            <div className="col-sm-10 strong ps-5">
              <div className="ps-5">{`${props.name}`}</div>
            </div>
            <div className="col-sm-2"> {`${props.value as string}`}</div>
          </div>
        ) : (
          <div className={`${getClassName()} row my-2 text-dark`}>
            <div className="col-sm-10 strong ps-5">{`${props.name}`}</div>
            <div className="col-sm-2"> {`${props.value as string}`}</div>
          </div>
        )}
      </div>
    );
};
