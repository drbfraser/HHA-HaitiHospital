import { ValidationResult } from '@hha/common';
import { ChangeEvent, HTMLInputTypeAttribute } from 'react';
import { useTranslation } from 'react-i18next';
import cn from 'classnames';

interface Translation {
  [lang: string]: string;
}

type FormFieldProps = {
  handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
  inputState: ValidationResult<string>;
  min?: number | string;
  nameId: string;
  prompt: Translation;
  type: HTMLInputTypeAttribute;
  value: number | string;
  readOnly?: boolean;
};

const FormField = (props: FormFieldProps) => {
  const { t, i18n } = useTranslation();
  const language = i18n.language;
  const prompt = props.prompt[language];
  const displayPrompt = prompt ?? props.prompt;
  console.log('FormField language: ', i18n.language);
  console.log('FormField prompt: ', prompt);
  return (
    <div className="form-group">
      <label className="fs-6 m-0 text-secondary" htmlFor={props.nameId}>
        {props.nameId.replaceAll('_', '.')}. {displayPrompt}
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
