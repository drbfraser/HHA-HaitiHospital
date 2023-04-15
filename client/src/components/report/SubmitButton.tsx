type SubmitButtonProps = {
  buttonText: string;
  disabled: boolean;
  readOnly: boolean;
};

const SubmitButton = ({ buttonText, disabled, readOnly }: SubmitButtonProps) => (
  <>
    {!readOnly && (
      <input className="btn btn-primary" disabled={disabled} type="submit" value={buttonText} />
    )}
  </>
);

export default SubmitButton;
