import { ValidationResult } from '@hha/common';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import cn from 'classnames';

type FormFieldProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputState: ValidationResult<string>;
  min?: number | string;
  nameId: string;
  prompt: string;
  type: HTMLInputTypeAttribute;
  value: number | string;
  readOnly?: boolean;
};

const FormField = (props: FormFieldProps) => {
  return (
    <div className="form-group">
      <label className="fs-6 m-0 text-secondary" htmlFor={props.nameId}>
        {props.nameId.replaceAll('_', '.')}. {props.prompt}
      </label>
      <input
        className={cn(
          {
            'is-invalid': props.inputState !== true,
            'form-control': !props.readOnly,
            'form-control-plaintext': props.readOnly,
          },
          'w-50',
        )}
        id={props.nameId}
        min={props.min}
        name={props.nameId}
        onChange={props.handleChange}
        type={props.type}
        value={props.value}
        disabled={props.readOnly}
      />
      {props.inputState !== true && (
        <div className="invalid-feedback">{props.inputState.message}</div>
      )}
    </div>
  );
};

export default FormField;
