type SubmitButtonProps = {
  buttonText: string;
  disabled: boolean;
  readOnly: boolean;
  showTooltip: boolean;
  tooltipText?: string;
};

const SubmitButton = ({ buttonText, disabled, readOnly, showTooltip, tooltipText }: SubmitButtonProps) => (
  <div className="position-sticky bottom-0 py-3">
    {!readOnly && (
      <div title={showTooltip && tooltipText ? tooltipText : undefined}>
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
