import { serializable } from "common/Serializer/ObjectSerializer";
import { QuestionItem } from "./QuestionItem";

export interface ValidationResult<ErrorType> {
    readonly error: ErrorType;
    readonly message?: string;
}

@serializable(undefined, "")
export abstract class Question<ID, T> extends QuestionItem<ID> {
    private readonly prompt: string;
    private answer?: T;

    private readonly validators: Array<(answer?: T) => ValidationResult<unknown>>;
    
    constructor(
        id: ID,
        prompt: string,
        defaultAnswer?: T,
    ) {
        super(id);
        this.prompt = prompt;
        this.answer = defaultAnswer;
        this.validators = new Array<(answer: T) => ValidationResult<unknown>>();
    }

    public readonly getPrompt = (): string => this.prompt;

    public readonly getAnswer = (): T | undefined => this.answer;

    public readonly setAnswer = (answer: T): void => {
        this.answer = answer;
    }

    public readonly addValidator = (validator: (answer?: T) => ValidationResult<unknown>): void => {
        this.validators.push(validator);
    }

    public readonly validate = (): Array<ValidationResult<unknown>> => {
        return this.validators
            .map((validator: (answer?: T) => ValidationResult<unknown>) => validator(this.answer));
    }

}