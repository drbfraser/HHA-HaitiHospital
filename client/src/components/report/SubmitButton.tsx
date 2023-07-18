type SubmitButtonProps = {
  buttonText: string;
  disabled: boolean;
  readOnly: boolean;
};

const SubmitButton = ({ buttonText, disabled, readOnly }: SubmitButtonProps) => (
  <div className="position-sticky bottom-0 py-3">
    {!readOnly && (
      <input
        className={`btn ${disabled ? 'btn-secondary' : 'btn-primary'}`}
        disabled={disabled}
        type="submit"
        value={buttonText}
      />
    )}
  </div>
);

export default SubmitButton;
