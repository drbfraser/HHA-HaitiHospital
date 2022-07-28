import { serializable } from "common/Serializer/ObjectSerializer";
import { Question } from "./Question";

// Choice for multiple choice questions
serializable("")
class Choice {
    private readonly description: string;
    private chosen: boolean;

    constructor(description: string) {
        this.description = description;
    }

    public readonly getDescription = (): string => {
        return this.description;
    }

    public readonly choose = (): void => {
        this.chosen = true;
    }

    public readonly unchoose = (): void => {
        this.chosen = false;
    }

    public readonly wasChosen = (): boolean => {
        return this.chosen;
    }
}

abstract class MultipleChoiceQuestion<ID, T> extends Question<ID, T> {

    protected readonly choices: Array<Choice>;

    constructor(id: ID, prompt: string, defaultAnswer?: T) {
        super(id, prompt, defaultAnswer);
        this.choices = new Array<Choice>();
    }

    public readonly addChoice = (choiceDescription: string): void => {
        this.choices.push(new Choice(choiceDescription));
    }

    // Return the choice descriptions in their respective order.
    public readonly getChoices = (): Array<string> => {
        return this.choices
            .map((choice) => choice.getDescription());
    }
}

// Multiple choice questions in which the user is only allowed to select one
// choice
@serializable(undefined, "")
export class SingleSelectionQuestion<ID> extends MultipleChoiceQuestion<ID, number> {
    // Won't do anything if answer index is greater than the number of choices
    public readonly setAnswer = (answer: number): void => {
        if (answer < 0 || answer >= this.choices.length) {
            return;
        }

        this.choices[this.getAnswer()]?.unchoose();
        this.choices[answer]?.choose();
        super.setAnswer(answer);
    }
}

// Multiple choice questions in which the user is allowed to select multiple
// choices.
@serializable(undefined, "")
export class MultipleSelectionQuestion<ID> extends MultipleChoiceQuestion<ID, Array<number>> {
    // Will ignore indexes whose value are greater than the number of choices
    public readonly setAnswer = (answer: Array<number>): void => {
        this.getAnswer()?.forEach(index => this.choices[index].unchoose());

        let filteredAnswer = answer.filter(index => index >= 0 && index < this.choices.length);
        filteredAnswer.forEach(index => this.choices[index].choose());
        super.setAnswer(filteredAnswer);
    }
}
