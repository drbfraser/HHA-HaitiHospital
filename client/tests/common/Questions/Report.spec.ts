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

enum QuestionTypes {
  label = 'label',
  sum = 'sum',
  numeric = 'numeric',
}

const buildReportFromJSON = (): QuestionNode<any, any>[] => {
  const questions: QuestionNode<any, any>[] = [];

  newNicuData.items.forEach((question, i) => {
    if (question.type === QuestionTypes.sum) {
      const compositionQuestion = compositionQuestionBuilder(
        i.toString(),
        parseInt(question.answer[0][0]),
        ...(question.items?.map(({ type, description, answer }, j) => ({
          id: j,
          prompt: description,
          defaultAnswer: parseInt(answer[0][0]),
        })) || []),
      );
      questions.push(compositionQuestion);
    } else if (question.type === QuestionTypes.numeric) {
      const numericQuestion = new NumericQuestion(
        i,
        question.description,
        parseInt(question.answer[0][0]),
      );
      questions.push(numericQuestion);
    }
  });

  console.log(questions);
  return questions;
};

const compositionQuestionBuilder = (
  id: string,
  defaultAnswer?: number,
  ...questions: NumericQuestionProps[]
): CompositionQuestion<string, unknown> => {
  const compositionQuestion = new CompositionQuestion(id, defaultAnswer);

  for (const question of questions) {
    compositionQuestion.add(
      new NumericQuestion(question.id, question.prompt, question.defaultAnswer || undefined),
    );
  }

  return compositionQuestion;
};

describe('Report', function () {
  describe('Mock report', function () {
    it('should create a mock report equivalent to the Nicu data', function () {
      buildReportFromJSON();

      // /**
      //  * MSPP Required
      //  * Questions 1 to 9
      //  */
      // const q1 = compositionQuestionBuilder(
      //   '1',
      //   60,
      //   {
      //     id: '1.1',
      //     prompt: 'Number of hospitalized in NICU',
      //     defaultAnswer: 29,
      //   },
      //   {
      //     id: '1.2',
      //     prompt: 'Number of hospitalized in Paediatrics',
      //     defaultAnswer: 10,
      //   },
      // );

      // const q2 = compositionQuestionBuilder(
      //   '2',
      //   12,
      //   {
      //     id: '2.1',
      //     prompt: 'Number of discharged alive in NICU',
      //     defaultAnswer: 33,
      //   },
      //   {
      //     id: '2.2',
      //     prompt: 'Number of discharged alive in Paediatrics',
      //     defaultAnswer: 47,
      //   },
      // );

      // const q3 = compositionQuestionBuilder(
      //   '3',
      //   91,
      //   {
      //     id: '3.1',
      //     prompt: 'Number that died BEFORE 48hrs in NICU',
      //     defaultAnswer: 45,
      //   },
      //   {
      //     id: '3.2',
      //     prompt: 'Number that died BEFORE 48hrs in Paediatrics',
      //     defaultAnswer: 14,
      //   },
      // );

      // const q4 = compositionQuestionBuilder(
      //   '4',
      //   91,
      //   {
      //     id: '4.1',
      //     prompt: 'Number that died BEFORE 48hrs in NICU',
      //     defaultAnswer: 45,
      //   },
      //   {
      //     id: '3.2',
      //     prompt: 'Number that died BEFORE 48hrs in Paediatrics',
      //     defaultAnswer: 14,
      //   },
      // );

      // /**
      //  * Question 1:
      //  * Total number of hospitalized patients
      //  */
      // const q1_1: NumericQuestion<string, unknown> = new NumericQuestion(
      //   '1.1',
      //   'Number of hospitalized in NICU',
      //   29,
      // );
      // const q1_2: NumericQuestion<string, unknown> = new NumericQuestion<string, unknown>(
      //   '1.2',
      //   'Number of hospitalized in Paediatrics',
      //   10,
      // );
      // const q1 = new CompositionQuestion('1', 60, q1_1, q1_2);

      // /**
      //  * Question 2:
      //  * Total number of patients discharged alive
      //  */
      // const q2_1 = new NumericQuestion('2.1', 'Number of discharged alive in NICU', 33);
      // const q2_2 = new NumericQuestion('2.2', 'Number of discharged alive in Paediatrics', 47);
      // const q2 = new CompositionQuestion('2', 12, q2_1, q2_2);

      // /**
      //  * Question 3:
      //  * Total number of patients that died BEFORE 48hrs
      //  */
      // const q3_1 = new NumericQuestion('3.1', 'Number that died BEFORE 48hrs in NICU', 45);
      // const q3_2 = new NumericQuestion('3.2', 'Number that died BEFORE 48hrs in Paediatrics', 14);
      // const q3 = new CompositionQuestion('3', 91, q2_1, q2_2);

      // const

      expect(1).to.equal(1);
    });
  });
});
