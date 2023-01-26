/*  A multiple choice question (MCQ) where you may choose only one or multiple
    alternative answers. A class exists for a question representing a multiple
    selection MCQ or a single selection MCQ.
*/
import { serializable } from '../Serializer/ObjectSerializer';
import { QuestionLeaf } from './QuestionLeaf';

// Choice for multiple choice questions
@serializable('')
class Choice {
  private readonly description: string;
  private chosen: boolean = false;

  constructor(description: string) {
    this.description = description;
  }

  public getDescription(): string {
    return this.description;
  }

  public choose(): void {
    this.chosen = true;
  }

  public unchoose(): void {
    this.chosen = false;
  }

  public wasChosen(): boolean {
    return this.chosen;
  }
}

export class ImmutableChoice {
  private readonly description: string;
  private readonly chosen: boolean;

  constructor(choice: Choice) {
    this.description = choice.getDescription();
    this.chosen = choice.wasChosen();
  }

  public getDescription() {
    return this.description;
  }

  public wasChosen() {
    return this.chosen;
  }
}

export abstract class MultipleChoiceQuestion<ID, T, ErrorType> extends QuestionLeaf<
  ID,
  T,
  ErrorType
> {
  protected readonly choices: Array<Choice> = new Array<Choice>();

  constructor(id: ID, prompt: string, choices: string[], defaultAnswer?: T) {
    super(id, prompt);
    this.addChoices(choices);
    if (defaultAnswer !== undefined) {
      this.setAnswer(defaultAnswer);
    }
  }

  private addChoices(choicesDescriptions: string[]): void {
    choicesDescriptions.forEach((choiceDescription) =>
      this.choices.push(new Choice(choiceDescription)),
    );
  }

  // Return the choice descriptions in their respective order.
  public getChoices(): Array<ImmutableChoice> {
    return this.choices.map((choice) => new ImmutableChoice(choice));
  }
}

// Multiple choice questions in which the user is only allowed to select one
// choice
@serializable(undefined, '', [])
export class SingleSelectionQuestion<ID, ErrorType> extends MultipleChoiceQuestion<
  ID,
  number,
  ErrorType
> {
  // Won't do anything if answer index is greater than the number of choices
  override setAnswer(answer: number): void {
    if (answer < 0 || answer >= this.choices.length) {
      return;
    }

    let oldAnswer: number | undefined = this.getAnswer();
    if (typeof oldAnswer === 'number') {
      this.choices[oldAnswer]?.unchoose();
      this.choices[answer]?.choose();
    }
    super.setAnswer(answer);
  }
}

// Multiple choice questions in which the user is allowed to select multiple
// choices.
@serializable(undefined, '', [])
export class MultipleSelectionQuestion<ID, ErrorType> extends MultipleChoiceQuestion<
  ID,
  Array<number>,
  ErrorType
> {
  // Will ignore indexes whose value are greater than the number of choices
  override setAnswer(answer: Array<number> = []): void {
    if (answer.length === 0) {
      return;
    }

    this.getAnswer()?.forEach((index) => this.choices[index]?.unchoose());

    let filteredAnswer = answer.filter((index) => index >= 0 && index < this.choices.length);
    filteredAnswer.forEach((index) => this.choices[index]?.choose());
    super.setAnswer(filteredAnswer);
  }
}
