// JSON for reporting errors across the stack.

export interface JsonValidationError {
  errorMessage: string;
}

export interface JsonValidationResults {
  id: string;
  errors?: Array<JsonValidationError>;
}
