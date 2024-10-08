import { ReactNode } from 'react';

export interface FormFieldDisplayProps {
  label: string;
  children: ReactNode;
  testid?: string;
}

export const FormFieldDisplay = ({ label, children, testid }: FormFieldDisplayProps) => (
  <div className="d-flex flex-column gap-1 align-items-start mb-3" data-testid={testid}>
    <small className="text-muted">{label}</small>
    {children}
  </div>
);
