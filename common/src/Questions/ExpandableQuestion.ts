/*  An expandable question represents a question whose answer determines how
    many groups of questions should be "expanded". One example of an expandable
    question is "How many people were hospitalized?". If the answer to this
    question is "3", then 3 groups of questions relating to the hospitalized
    patients are expanded (questions such as "Cause of hospitalization", or 
    "Age"), where each expanded group of questions might relate to each
    hospitalized person.
*/
import { QuestionAnswerParent } from './QuestionAnswer';
import { QuestionGroup } from './QuestionGroup';
import { QuestionNode } from './QuestionNode';
import { ObjectSerializer, serializable } from '../Serializer/ObjectSerializer';
import {
  ERROR_NOT_A_INTEGER,
  isNumber,
  runNumericValidators,
  ValidationResult,
} from '../Form_Validators';

type Translation = Record<string, string>;

@serializable(undefined, '', (arg: any) => undefined)
export class ExpandableQuestion<ID, ErrorType> extends QuestionAnswerParent<ID, number, ErrorType> {
  private answer: number = 0;
  private questionGroups: Array<QuestionGroup<ID, ErrorType>> = [];
  private readonly idGenerator: (questionGroupIndex: number) => ID;
  private readonly questionsTemplate: QuestionGroup<ID, ErrorType>;
  private readonly validators: string[] = ['isPositive'];

  constructor(
    id: ID,
    prompt: Translation,
    idGenerator: (questionGroupIndex: number) => ID,
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ) {
    super(id, prompt);
    this.idGenerator = idGenerator;
    const translations: string[] = Object.values(prompt).filter(Boolean) as string[];
    const firstPromptValue: string | undefined = translations.length > 0 ? translations[0] : undefined;
    const templateName: Translation = firstPromptValue ? { [firstPromptValue]: firstPromptValue } : {};
    this.questionsTemplate = new QuestionGroup<ID, ErrorType>(
      idGenerator(0),
      templateName,
    ).addAll(...questions);
  }

  public addToTemplate(
    questionItem: QuestionNode<ID, ErrorType>,
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.add(questionItem);
    return this;
  }

  public addAllToTemplate(
    ...questions: Array<QuestionNode<ID, ErrorType>>
  ): ExpandableQuestion<ID, ErrorType> {
    this.questionsTemplate.addAll(...questions);
    return this;
  }

  public searchById(id: ID): QuestionNode<ID, ErrorType> | undefined {
    return this.questionGroups
      .map((questionGroup) => questionGroup.searchById(id))
      .find((question) => question !== undefined);
  }

  private expand(): void {
    if (this.getAnswer() > this.questionGroups.length) {
      for (let i = this.questionGroups.length; i < this.getAnswer(); i++) {
        const lang: string = 'en'; // Set the desired language code here
        const promptValue: string | undefined = this.getPrompt(lang);
        const promptText: string = promptValue || '';
        const questionGroupName: Translation = {
          [lang]: `${promptText}-${i}`,
        };

        this.questionGroups.push(
          new QuestionGroup(
            this.idGenerator(i + 1),
            questionGroupName,
            ...this.questionsTemplate.genericMap<QuestionNode<ID, ErrorType>>((q) => {
              let serializer: ObjectSerializer = ObjectSerializer.getObjectSerializer();
              return serializer.deserialize(serializer.serialize(q));
            }),
          ),
        );
      }
    }
  }

  private shrink(): void {
    if (this.getAnswer() < this.questionGroups.length) {
      this.questionGroups = this.questionGroups.slice(0, this.getAnswer());
    }
  }

  public setAnswer(answer: number): void {
    this.answer = answer;

    if (this.getValidationResults() !== true) {
      return;
    } else if (answer < this.questionGroups.length) {
      this.shrink();
    } else if (answer > this.questionGroups.length) {
      this.expand();
    }
  }

  public getAnswer(): number {
    return this.answer;
  }

  public getTemplate(): QuestionGroup<ID, ErrorType> {
    return this.questionsTemplate;
  }

  public getValidators() {
    return this.validators;
  }

  public addValidator(validator: string) {
    this.validators.push(validator);
  }


  public getValidationResults(): ValidationResult<string> {
    if (!isNumber(this.getAnswer())) {
      return ERROR_NOT_A_INTEGER;
    }
    return this.checkValidators();
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

  public forEach(groupHandler: (groupInstance: QuestionGroup<ID, ErrorType>) => void): void {
    this.questionGroups.forEach(groupHandler);
  }

  public map<T>(mapper: (groupInstance: QuestionGroup<ID, ErrorType>, index: number) => T): T[] {
    return this.questionGroups.map(mapper);
  }
}
