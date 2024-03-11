import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface Translation {
  [lang: string]: string;
}

type FormFieldCheckProps = {
  children: ReactNode;
  nameId: string;
  prompt: Translation;
};

const FormFieldCheck = ({ children, nameId, prompt }: FormFieldCheckProps) => {
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;
  const displayPrompt = prompt[language] || prompt; // Fallback to default prompt if translation is not available

  return (
    <fieldset className="form-group">
      <legend className="fs-6 m-0 text-secondary">
        <>
          {nameId.replaceAll('_', '.')}. {displayPrompt}
        </>
      </legend>
      {children}
    </fieldset>
  );
};

export default FormFieldCheck;
