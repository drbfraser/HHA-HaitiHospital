type SubmitButtonProps = {
  buttonText: string;
  disabled: boolean;
  readOnly: boolean;
  tooltipText?: string;
};

const SubmitButton = ({ buttonText, disabled, readOnly, tooltipText }: SubmitButtonProps) => (
  <div className="position-sticky bottom-0 py-3" data-testid="report-submit-button">
    {!readOnly && (
      <div title={tooltipText ? tooltipText : undefined}>
        <input
          className={`btn ${disabled ? 'btn-secondary' : 'btn-primary'}`}
          name="submit"
          disabled={disabled}
          type="submit"
          value={buttonText}
        />
      </div>
    )}
  </div>
);

export default SubmitButton;
