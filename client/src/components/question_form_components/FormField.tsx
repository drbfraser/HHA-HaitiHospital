import { ChangeEvent, HTMLInputTypeAttribute, useState } from 'react';
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
  style?: React.CSSProperties;
  hideLabel?: boolean;
};

const FormField = (props: FormFieldProps) => {
  const { i18n } = useTranslation();
  const [touched, setTouched] = useState<boolean>(false);
  const language = i18n.resolvedLanguage;

  const prompt = typeof props.prompt !== 'string' ? props.prompt[language] : props.prompt;
  const value = props.value ?? ''; // Set a default value if props.value is null
  const label = props.nameId.replaceAll('_', '.');
  const hideLabel = props.hideLabel ?? false;

  return (
    <div className="form-group min-width-form-field">
      <label className="fs-10 m-0 text-secondary" htmlFor={props.nameId}>
        {!hideLabel && `${label}.`} {prompt}
      </label>
      <input
        className={cn(
          {
            'is-invalid': (touched || value !== '') && props.inputState !== true,
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
        style={props.style}
        onBlur={() => setTouched(true)}
        data-testid="form-field"
      />
      {!props.readOnly && (touched || value !== '') && props.inputState !== true && (
        <div className="invalid-feedback">{props.inputState.message?.[language]}</div>
      )}
    </div>
  );
};

export default FormField;
