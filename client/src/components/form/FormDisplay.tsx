interface FormDisplayProps {
  children: React.ReactNode;
}

export const FormDisplay = ({ children }: FormDisplayProps) => (
  <div className="d-flex flex-row">{children}</div>
);
