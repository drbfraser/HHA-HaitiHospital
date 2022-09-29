import { CompositionQuestion } from '../../../src/common/Questions/CompositionQuestion';
import { NumericQuestion } from '../../../src/common/Questions/SimpleQuestionTypes';
import { QuestionNode } from '../../../src/common/Questions/QuestionNode';
import newNicuData from '../../../src/components/report/newNicuData.json';

import { expect } from 'chai';

interface NumericQuestionProps {
  id: string;
  prompt: string;
  defaultAnswer?: number;
}

// Question types in the mock NICU JSON report data
enum QuestionTypes {
  label = 'label',
  sum = 'sum',
  numeric = 'numeric',
  equal = 'equal',
}

// Extracts the answer from a question in the NICU JSON as a number type
const getAnswer = (answer: string[][]): number => parseInt(answer[0][0]);

// Returns a CompositionQuestion object using the given arguments
const compositionQuestionBuilder = (
  id: string,
  defaultAnswer?: number,
  ...questions: NumericQuestionProps[]
): CompositionQuestion<string, string> => {
  const compositionQuestion: CompositionQuestion<string, string> = new CompositionQuestion<
    string,
    string
  >(id, defaultAnswer);

  for (const question of questions) {
    compositionQuestion.add(
      new NumericQuestion(question.id, question.prompt, question.defaultAnswer || undefined),
    );
  }

  return compositionQuestion;
};

// Returns a mock report (array) of question from the mock NICU JSON report data
// This function builds this array using the question data structures in common/Questions
const buildMockNICUReport = (): QuestionNode<any, any>[] => {
  const questions: QuestionNode<any, any>[] = [];

  // Go through each question item and create the appopriate question object
  newNicuData.items.forEach((currentQuestion, i) => {
    switch (currentQuestion.type) {
      // Composition Question
      case QuestionTypes.equal:
      case QuestionTypes.sum:
        const compositionQuestion = compositionQuestionBuilder(
          i.toString(),
          getAnswer(currentQuestion.answer),
          ...(currentQuestion.items?.map(({ type, description, answer }, j) => ({
            id: `${i}-${j + 1}`,
            prompt: description,
            defaultAnswer: getAnswer(answer),
          })) || []),
        );

        questions.push(compositionQuestion);
        break;

      // Numeric Question
      case QuestionTypes.numeric:
        const numericQuestion = new NumericQuestion(
          i.toString(),
          currentQuestion.description,
          getAnswer(currentQuestion.answer),
        );
        questions.push(numericQuestion);
        break;

      default:
        break;
    }
  });

  return questions;
};

describe('Report', function () {
  describe('Mock report', function () {
    it('should create a mock report equivalent to the Nicu data', function () {
      const report: QuestionNode<any, any>[] = buildMockNICUReport();

      expect(report[0].getId()).to.equal('1');
    });
  });
});
