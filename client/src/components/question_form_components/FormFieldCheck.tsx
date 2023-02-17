import { ReactNode } from 'react';

type FormFieldCheckProps = {
  children: ReactNode;
  nameId: string;
  prompt: string;
};

const FormFieldCheck = ({ children, nameId, prompt }: FormFieldCheckProps) => {
  return (
    <fieldset className="form-group">
      <legend className="fs-6 m-0 text-secondary">
        {nameId.replaceAll('_', '.')}. {prompt}
      </legend>
      {children}
    </fieldset>
  );
};

export default FormFieldCheck;
