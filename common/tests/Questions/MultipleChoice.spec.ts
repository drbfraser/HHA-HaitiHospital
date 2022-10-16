import { expect } from 'chai';
import { QuestionLeafTest, QuestionLeafTestArgs } from './QuestionLeaf.spec';
import { MultipleChoiceQuestion, SingleSelectionQuestion } from '../../src/Questions/MultipleChoice'
import { TEST_ARGS_STR, TEST_CLASS_STR } from '../Constants';

export interface MultipleChoiceQuestionTestArgs<ID, T, ErrorType> extends QuestionLeafTestArgs<ID, T, ErrorType> {
	choices: string[]
}

export abstract class MultipleChoiceQuestionTest<ID, T, ErrorType> extends QuestionLeafTest<ID, T, ErrorType> {
	
	private readonly multipleChoiceQuestionTestArgs: MultipleChoiceQuestionTestArgs<ID, T, ErrorType>;
	private readonly multipleChoiceConstructor: 
		(id: ID, prompt: string, choices: string[], defaultAnswer?: T) => MultipleChoiceQuestion<ID, T, ErrorType>;

	constructor(
		multipleChoiceConstructor: (id: ID, prompt: string, choices: string[], defaultAnswer?: T) => MultipleChoiceQuestion<ID, T, ErrorType>,
		args: MultipleChoiceQuestionTestArgs<ID, T, ErrorType>
	) {
		super(
			(id: ID, prompt: string, defaultAnswer?: T) => multipleChoiceConstructor(id, prompt, args.choices, defaultAnswer),
			args
		);	
		
		this.multipleChoiceConstructor = multipleChoiceConstructor;
		this.multipleChoiceQuestionTestArgs = args;
		
		this.addTests(
			this.testGetChoices
		)
	}
	
	public readonly testGetChoices = (): void => {
		describe(TEST_CLASS_STR, () => {
			it('Should get the same choices that have been passed during construction', () => {
				let multipleChoice = 
					this.multipleChoiceConstructor(this.multipleChoiceQuestionTestArgs.defaultId, this.multipleChoiceQuestionTestArgs.defaultPrompt, this.multipleChoiceQuestionTestArgs.choices);
				expect(multipleChoice.getChoices()).to.have.members(this.multipleChoiceQuestionTestArgs.choices);
			});
		});
	}
}

export interface SingleSelectionQuestionTestArgs extends MultipleChoiceQuestionTestArgs<number, number, string> {}

export class SingleSelectionQuestionTest extends MultipleChoiceQuestionTest<number, number, string> {
	private readonly singleSelectionQuestionConstructor = 
		(id: number, prompt: string, choices: string[], defaultAnswer?: number) => new SingleSelectionQuestion(id, prompt, choices, defaultAnswer);	
	private readonly args: SingleSelectionQuestionTestArgs;

	constructor(
		args: SingleSelectionQuestionTestArgs
	) {
		super(
			(id: number, prompt: string, choices: string[], defaultAnswer?: number) => new SingleSelectionQuestion(id, prompt, choices, defaultAnswer),
			args
		);
		
		this.args = args;
		
		this.addTests(
			this.testGetAndSetAnswer
		);
	}
	
	public testGetAndSetAnswer(): void {
		describe(TEST_CLASS_STR, () => {
			it('Choices arguments to include two choices', () => {
				expect(this.args.choices).to.be.above(2);
			})
			
			it('Default answer should be within choices range', () => {
				expect(this.args.defaultAnswer).to.be.below(this.args.choices.length);
			});
			
			it('Alternative answer should be within choices range', () => {
				expect(this.args.alternativeAnswer).to.be.within(0, this.args.choices.length - 1);
			});
		});
		
		super.testGetAndSetAnswer();
		
		describe(TEST_CLASS_STR, () => {
			it('Should not change answer if we give a number out of range', () => {
				let question = this.singleSelectionQuestionConstructor(this.args.defaultId, this.args.defaultPrompt, this.args.choices, this.args.defaultAnswer);
				question.setAnswer(this.args.defaultAnswer);
				question.setAnswer(question.getChoices.length + 2);
				expect(question.getAnswer).to.be.equal(this.args.defaultAnswer)
			});
		});
	}
}

describe("SingleSelectionQuestion", function() {
	(new SingleSelectionQuestionTest({
		choices: ["Linux", "Windows", "TempleOS", "MacOS"],
		
		defaultPrompt: "What is the best OS?",
		
		answerEqual: (answer1: number, answer2: number) => answer1 === answer2,
		defaultAnswer: 0,
		alternativeAnswer: 2,
		
		sampleValidator: (answer?: number) => {
			return {
				isValid: answer !== 1
			};
		},
		validAnswer: 0,
		invalidAnswer: 1,
		
		idEqual: (id1: number, id2: number) => id1 === id2,
		defaultId: 1
		})).testAll();
});
