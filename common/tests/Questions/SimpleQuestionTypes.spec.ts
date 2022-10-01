import { expect } from 'chai';
import { NumericQuestion, TextQuestion } from '../../src';
import { QuestionLeafTest } from './QuestionLeaf.spec';

export class TextQuestionTest extends QuestionLeafTest<number, string, string> {
  constructor() {
    super(
      (id: number, prompt: string, defaultAnswer?: string) => new TextQuestion(id, prompt, defaultAnswer),
      {
        defaultId: 0,
        idEqual: (id1: number, id2: number) => id1 === id2,

        defaultPrompt: 'What is the best OS?',

        answerEqual: (answer1: string, answer2: string) => answer1 === answer2,
        defaultAnswer: 'Linux',
        alternativeAnswer: 'Temple OS',

        sampleValidator: (answer?: string) => {
          return {
            isValid: answer?.startsWith('L') ?? true
          }
        },
        validAnswer: 'Linux',
        invalidAnswer: 'Windows'
      }
    );
  };
}

export class NumericQuestionTest extends QuestionLeafTest<number, number, string> {
  constructor() {
    super(
      (id: number, prompt: string, defaultAnswer?: number) => new NumericQuestion(id, prompt, defaultAnswer),
      {
        defaultId: 0,
        idEqual: (id1: number, id2: number) => id1 === id2,

        defaultPrompt: 'Is the number even?',

        answerEqual: (answer1: number, answer2: number) => answer1 === answer2,
        defaultAnswer: 2,
        alternativeAnswer: 4,

        sampleValidator: (answer?: number) => {
          return {
            isValid: answer % 2 === 0
          }
        },
        validAnswer: 2,
        invalidAnswer: 3
      }
    );
  }
}

describe("TextQuestion", function() {
  (new TextQuestionTest()).testAll();
  (new NumericQuestionTest()).testAll();
})
