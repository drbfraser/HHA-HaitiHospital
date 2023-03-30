type SubmitButtonProps = {
  buttonText: string;
  disabled: boolean;
  readOnly: boolean;
};

export const SubmitButton = ({ buttonText, disabled, readOnly }: SubmitButtonProps) => (
  <>
    {!readOnly && (
      <input
        className="btn btn-outline-primary"
        disabled={disabled}
        type="submit"
        value={buttonText}
      />
    )}
  </>
);
