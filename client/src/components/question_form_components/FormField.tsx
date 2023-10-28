import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

import { ValidationResult } from '@hha/common';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

interface Translation {
  [lang: string]: string;
}

type FormFieldProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputState: ValidationResult<string>;
  min?: number | string;
  nameId: string;
  prompt: Translation | string;
  type: HTMLInputTypeAttribute;
  value: number | string;
  readOnly?: boolean;
};

const FormField = (props: FormFieldProps) => {
  const {
    i18n: { language },
  } = useTranslation();

  const prompt = props.prompt[language.substring(0, 2)] || props.prompt || '';
  const value = props.value ?? ''; // Set a default value if props.value is null

  return (
    <div className="form-group min-width-form-field">
      <label className="fs-10 m-0 text-secondary" htmlFor={props.nameId}>
        {props.nameId.replaceAll('_', '.')}. {prompt}
      </label>
      <input
        className={cn(
          {
            'is-invalid': props.inputState !== true,
            'form-control': !props.readOnly,
            'form-control-plaintext': props.readOnly,
          },
          'w-50',
          'min-width-input',
        )}
        id={props.nameId}
        min={props.min}
        name={props.nameId}
        onChange={props.handleChange}
        type={props.type}
        value={value}
        disabled={props.readOnly}
      />
      {props.inputState !== true && (
        <div className="invalid-feedback">{props.inputState.message}</div>
      )}
    </div>
  );
};

export default FormField;
