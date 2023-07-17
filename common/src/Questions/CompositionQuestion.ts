/*  A composition question represents a question whose answer must be equal
    to the sum of its numeric children questions.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { SpecializedGroup } from '.';
import { QuestionAnswerNode, QuestionAnswerParent } from './QuestionAnswer';
import {
  ERROR_DOES_NOT_SUM_UP,
  ERROR_NOT_A_INTEGER,
  isNumber,
  runNumericValidators,
  ValidationResult,
} from '../Form_Validators';

type ChildType<ID, ErrorType> = SpecializedGroup<
  ID,
  ErrorType,
  QuestionAnswerNode<ID, number, ErrorType>
>;
type AllSumUpInfo = {
  areAllSumsCorrect: boolean;
  invalidGroupsIndices: number[];
};

type Translation = Record<string, string>;

@serializable(undefined)
export class CompositionQuestion<ID, ErrorType> extends QuestionAnswerParent<
  ID,
  number,
  ErrorType
> {
  private answer: number | undefined = 0;
  private promptTranslation: Translation = {};
  private readonly compositionGroups: Array<ChildType<ID, ErrorType>>;
  private readonly validators: string[] = ['isPositive'];

  constructor(id: ID, prompt: Translation, ...questions: Array<ChildType<ID, ErrorType>>) {
    super(id, prompt);
    this.compositionGroups = questions;
  }

  public searchById(id: ID): ChildType<ID, ErrorType> | undefined {
    return this.compositionGroups.find((question) => question.getId() === id);
  }

  public getAnswer(): number | undefined {
    return this.answer;
  }

  // Changes answer if given a non-negative number
  public setAnswer(answer: number): void {
    this.answer = answer;
  }

  public getValidators() {
    return this.validators;
  }

  public addValidator(validator: string) {
    this.validators.push(validator);
  }

  public getPromptTranslation(): Translation {
    return this.promptTranslation;
  }

  public setPromptTranslation(translation: Translation): void {
    this.promptTranslation = translation;
  }

  private checkValidators(): ValidationResult<string> {
    for (const validatorName of this.getValidators()) {
      const validate = runNumericValidators[validatorName];

      if (validate && validate(this.getAnswer()!) !== true) {
        return validate(this.getAnswer()!);
      }
    }

    return true;
  }

  private compositionGroupSumsUp(compositionGroup: ChildType<ID, ErrorType>): boolean {
    return (
      compositionGroup
        .map((question) => question.getAnswer() ?? 0)
        .reduce((answer1, answer2) => answer1 + answer2) === this.getAnswer()
    );
  }

  public getAllSumUpInfo(): AllSumUpInfo {
    const info: AllSumUpInfo = {
      areAllSumsCorrect: true,
      invalidGroupsIndices: [],
    };

    if (!isNumber(this.getAnswer()) || this.checkValidators() !== true) {
      return info;
    } else if (this.compositionGroups.length === 0) {
      return info;
    }

    info.areAllSumsCorrect = this.compositionGroups
      .map((compositionGroup, index) => {
        const doesGroupSumAddUpToAns = this.compositionGroupSumsUp(compositionGroup);
        !doesGroupSumAddUpToAns && info.invalidGroupsIndices.push(index);
        return doesGroupSumAddUpToAns;
      })
      .reduce((bool1, bool2) => bool1 && bool2);

    return info;
  }

  public getValidationResults(): ValidationResult<string> {
    if (!isNumber(this.getAnswer())) {
      return ERROR_NOT_A_INTEGER;
    } else if (this.checkValidators() !== true) {
      return this.checkValidators();
    } else if (!this.getAllSumUpInfo().areAllSumsCorrect) {
      return ERROR_DOES_NOT_SUM_UP;
    }
    return true;
  }

  public forEach(numberGroupHandler: (numberGroup: ChildType<ID, ErrorType>) => void): void {
    this.compositionGroups.forEach(numberGroupHandler);
  }

  public map<T>(mapper: (numberGroup: ChildType<ID, ErrorType>, index: number) => T): T[] {
    return this.compositionGroups.map(mapper);
  }
}
