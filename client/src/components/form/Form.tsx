import { Button } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

interface Props {
  onSubmit: (data: any) => void;
  children: React.ReactNode;
  className?: string;
}

export const Form = ({ onSubmit, children, className }: Props) => {
  const { t } = useTranslation();

  return (
    <form
      onSubmit={onSubmit}
      className={`form-group d-flex flex-column gap-3 m-0 p-0 ${className}`}
    >
      {children}
      <div>
        <Button data-testid="submit-biomech-button" type="submit">
          {t('button.submit')}
        </Button>
      </div>
    </form>
  );
};
