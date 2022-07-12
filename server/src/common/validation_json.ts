// JSON for reporting errors across the stack.

export interface JsonValidationError {
    errorMessage: string;
}

/*
    Parameters:
        id -  This is necessary for situations where identifying the data sent 
        from the front is not obvious (e.g. when we have multiple fields of the 
        same type or possibly nested items).

        errors - Should be empty when no errors were found.
*/
export interface JsonValidationResults {
    id: string;
    errors: Array<JsonValidationError>
}