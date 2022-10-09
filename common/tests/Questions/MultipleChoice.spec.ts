import { expect } from 'chai';
import { QuestionLeafTest, QuestionLeafTestArgs } from './QuestionLeaf.spec';
import { MultipleChoiceQuestion } from '../../src/Questions/MultipleChoice'
import { TEST_ARGS_STR, TEST_CLASS_STR } from '../Constants';

export interface MultipleChoiceQuestionTestArgs<ID, T, ErrorType> extends QuestionLeafTestArgs<ID, T, ErrorType> {
	choices: string[]
}

export abstract class MultipleChoiceQuestionTest<ID, T, ErrorType> extends QuestionLeafTest<ID, T, ErrorType> {
	
	private readonly multipleChoiceQuestionTestArgs: MultipleChoiceQuestionTestArgs<ID, T, ErrorType>;
	private readonly multipleChoiceConstructor: 

		(id: ID, prompt: string, ...choices: string[]) => MultipleChoiceQuestion<ID, T, ErrorType>;
	constructor(
		multipleChoiceConstructor: (id: ID, prompt: string, ...choices: string[]) => MultipleChoiceQuestion<ID, T, ErrorType>,
		args: MultipleChoiceQuestionTestArgs<ID, T, ErrorType>
	) {
		super(
			(id: ID, prompt: string, defaultAnswer?: T) => multipleChoiceConstructor(id, prompt),
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
					this.multipleChoiceConstructor(this.multipleChoiceQuestionTestArgs.defaultId, this.multipleChoiceQuestionTestArgs.defaultPrompt, ...this.multipleChoiceQuestionTestArgs.choices);
				expect(multipleChoice.getChoices()).to.have.members(this.multipleChoiceQuestionTestArgs.choices);
			});
		});
	}
}
