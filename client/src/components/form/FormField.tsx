import { FormLabel } from 'react-bootstrap';

interface Props {
  children: React.ReactNode;
  htmlFor: string;
  label: string;
  required?: boolean;
}

export const FormField = ({ children, htmlFor, label, required = false }: Props) => (
  <div className="d-flex flex-column gap-1">
    <FormLabel htmlFor={htmlFor} className="form-label small text-muted">
      {label}
      {required && <b className="text-danger mx-1">*</b>}
    </FormLabel>
    {children}
  </div>
);
