import {
  CompositionQuestion,
  ExpandableQuestion,
  MultipleSelectionQuestion,
  NumericQuestion,
  QuestionGroup,
  SingleSelectionQuestion,
  SpecializedGroup,
  TextQuestion,
} from './Questions';

import { QuestionAnswerNode } from './Questions/QuestionAnswer';

import translationEN from '../src/locales/en/translationEN.json';
import translationFR from '../src/locales/fr/translationFR.json';

type ID = string;
type ErrorType = string;

const translations: { [key: string]: any } = {
  en: translationEN,
  fr: translationFR,
};


const questionIdGeneratorBuilder =
  (questionId: ID) =>
  (questionGroupIndex: number): ID =>
    `${questionId}_${questionGroupIndex}`;

export const oneQuestionMockReport = (): QuestionGroup<ID, ErrorType> => {
  const report: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('ROOT', {
    en: 'OneQuestionReport',
    fr: 'test',
  });
  const q1 = new TextQuestion<ID, ErrorType>('1', { en: 'What is your name?', fr: 'test' });
  report.add(q1);

  return report;
};

export const buildRehabMockReport = (): QuestionGroup<ID, ErrorType> => {
  const getQuestionContent = (questionKey: string) => {
    return {
      en: translations['en'].rehabReportQuestions[questionKey],
      fr: translations['fr'].rehabReportQuestions[questionKey],
    };
  };

  const reportID: ID = 'rehab-report_1_1';

  const rehabReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(reportID, {
    en: 'Rehab Report',
    fr: 'Rapport de Rehab',
  });

  // Questions 1 to 4
  const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '1',
    getQuestionContent('question1'),
    0,
  );
  q1.addValidator('isEven');

  const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '2',
    getQuestionContent('question2'),
    0,
  );

  const q3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '3',
    getQuestionContent('question3'),
    0,
  );

  const q4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '4',
    getQuestionContent('question4'),
    0,
  );

  // Question 5
  const q5: ExpandableQuestion<ID, ErrorType> = new ExpandableQuestion<ID, ErrorType>(
    '5',
    getQuestionContent('question5'),
    questionIdGeneratorBuilder('5'),
  );
  const q5_1: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_1',
    getQuestionContent('question5_1'),
    ['SCI', 'Stroke', 'Other'],
    0,
  );
  const q5_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '5_2',
    getQuestionContent('question5_2'),
    0,
  );
  const q5_3: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_3',
    getQuestionContent('question5_3'),
    [
      'All goals met',
      'Goals partially met, sufficient for discharge',
      'Goals not met, discharged for alternate reason',
    ],
    0,
  );
  const q5_4: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_4',
    getQuestionContent('question5_4'),
    [
      'Independent',
      'Modified Independent',
      'Supervision',
      'Minimum Assistance',
      'Moderate Assistance',
      'Maximum Assistance',
      'Dependent',
    ],
    0,
  );
  const q5_5: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_5',
    getQuestionContent('question5_5'),
    [
      'Independent',
      'Modified Independent',
      'Supervision',
      'Minimum Assistance',
      'Moderate Assistance',
      'Maximum Assistance',
      'Dependent',
    ],
    0,
  );
  const q5_6: MultipleSelectionQuestion<ID, ErrorType> = new MultipleSelectionQuestion<
    ID,
    ErrorType
  >('5_6', getQuestionContent('question5_6'), ['Wheelchair', 'Walker', 'Cane', 'Crutches'], []);
  const q5_7: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_7',
    getQuestionContent('question5_7'),
    ['Return home, alone', 'Return home, with family/caregiver(s)', 'Admitted to hospital'],
    0,
  );
  const q5_8: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_8',
    getQuestionContent('question5_8'),
    [
      'Employed',
      'Unemployed, unable to find work',
      'Unemployed, due to condition',
      'Retired, not working due to age',
    ],
    0,
  );
  q5.addAllToTemplate(q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8);

  // Question 6
  const q6: ExpandableQuestion<ID, ErrorType> = new ExpandableQuestion<ID, ErrorType>(
    '6',
    getQuestionContent('question6'),
    questionIdGeneratorBuilder('6'),
  );
  const q6_1: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '6_1',
    getQuestionContent('question6_1'),
    ['SCI', 'CVA', 'Other'],
  );
  const q6_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '6_2',
    getQuestionContent('question6_2'),
  );
  const q6_3: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '6_3',
    getQuestionContent('question6_3'),
    ['Suspected CVA'],
  );
  q6.addAllToTemplate(q6_1, q6_2, q6_3);

  // Question 7
  const q7: ExpandableQuestion<ID, ErrorType> = new ExpandableQuestion<ID, ErrorType>(
    '7',
    getQuestionContent('question7'),
    questionIdGeneratorBuilder('7'),
  );
  const q7_1: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '7_1',
    getQuestionContent('question7_1'),
    ['SCI', 'CVA', 'Other'],
  );
  const q7_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '7_2',
    getQuestionContent('question7_2'),
  );
  const q7_3: TextQuestion<ID, ErrorType> = new TextQuestion<ID, ErrorType>(
    '7_3',
    getQuestionContent('question7_3'),
  );
  q7.addAllToTemplate(q7_1, q7_2, q7_3);

  // Questions 8 to 10
  const q8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '8',
    getQuestionContent('question8'),
    0,
  );

  const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '9',
    getQuestionContent('question9'),
    0,
  );

  const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '10',
    getQuestionContent('question10'),
    0,
  );

  // Question 11
  const q11: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11',
    getQuestionContent('question11'),
    0,
  );

  // Question 12
  const q12_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_1_1',
    getQuestionContent('question12_1_1'),
    0,
  );
  const q12_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_1_2',
    getQuestionContent('question12_1_2'),
    0,
  );
  const q12_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_1_3',
    getQuestionContent('question12_1_3'),
    0,
  );
  // const q12_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('12_1_4', 'Financial/no place to discharge to');
  const q12_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '12_1',
    getQuestionContent('question12_1'),
    q12_1_1,
    q12_1_2,
    q12_1_3,
  );

  const q12_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_1',
    getQuestionContent('question12_2_1'),
    0,
  );
  const q12_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_2',
    getQuestionContent('question12_2_2'),
    0,
  );
  const q12_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_3',
    getQuestionContent('question12_2_3'),
    0,
  );
  const q12_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_4',
    getQuestionContent('question12_2_4'),
    0,
  );
  const q12_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_5',
    getQuestionContent('question12_2_5'),
    0,
  );
  const q12_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_2_6',
    getQuestionContent('question12_2_6'),
    0,
  );
  const q12_2: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '12_2',
    getQuestionContent('question12_2'),
    q12_2_1,
    q12_2_2,
    q12_2_3,
    q12_2_4,
    q12_2_5,
    q12_2_6,
  );

  const q12: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '12',
    getQuestionContent('question12'),
    q12_1,
    q12_2,
  );

  // Question 13
  const q13_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_1',
    getQuestionContent('question13_1_1'),
    0,
  );
  const q13_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_2',
    getQuestionContent('question13_1_2'),
    0,
  );
  const q13_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_3',
    getQuestionContent('question13_1_3'),
    0,
  );
  const q13_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_4',
    getQuestionContent('question13_1_4'),
    0,
  );
  const q13_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_1',
    getQuestionContent('question13_1'),
    q13_1_1,
    q13_1_2,
    q13_1_3,
    q13_1_4,
  );

  const q13_2_1_1_1 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_1',
    getQuestionContent('question13_2_1_1_1'),
    0,
  );
  const q13_2_1_1_2 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_2',
    getQuestionContent('question13_2_1_1_2'),
    0,
  );
  const q13_2_1_1_3 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_3',
    getQuestionContent('question13_2_1_1_3'),
    0,
  );
  const q13_2_1_1_4 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_4',
    getQuestionContent('question13_2_1_1_4'),
    0,
  );
  const q13_2_1_1_5 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_5',
    getQuestionContent('question13_2_1_1_5'),
    0,
  );
  const q13_2_1_1_6 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_6',
    getQuestionContent('question13_2_1_1_6'),
    0,
  );
  const q13_2_1_1_7 = new NumericQuestion<ID, ErrorType>(
    '13_2_1_1_7',
    getQuestionContent('question13_2_1_1_7'),
    0,
  );
  const q13_2_1_1 = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_2_1_1',
    getQuestionContent('question13_2_1_1'),
    q13_2_1_1_1,
    q13_2_1_1_2,
    q13_2_1_1_3,
    q13_2_1_1_4,
    q13_2_1_1_5,
    q13_2_1_1_6,
    q13_2_1_1_7,
  );
  const q13_2_1 = new CompositionQuestion<ID, ErrorType>(
    '13_2_1',
    getQuestionContent('question13_2_1_1'),
    q13_2_1_1,
  );

  const q13_2_2_1_1 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_1',
    getQuestionContent('question13_2_2_1_1'),
    0,
  );
  const q13_2_2_1_2 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_2',
    getQuestionContent('question13_2_2_1_2'),
    0,
  );
  const q13_2_2_1_3 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_3',
    getQuestionContent('question13_2_2_1_3'),
    0,
  );
  const q13_2_2_1_4 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_4',
    getQuestionContent('question13_2_2_1_4'),
    0,
  );
  const q13_2_2_1_5 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_5',
    getQuestionContent('question13_2_2_1_5'),
    0,
  );
  const q13_2_2_1_6 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_6',
    getQuestionContent('question13_2_2_1_6'),
    0,
  );
  const q13_2_2_1_7 = new NumericQuestion<ID, ErrorType>(
    '13_2_2_1_7',
    getQuestionContent('question13_2_2_1_7'),
    0,
  );
  const q13_2_2_1 = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_2_2_1',
    getQuestionContent('question13_2_2_1'),
    q13_2_2_1_1,
    q13_2_2_1_2,
    q13_2_2_1_3,
    q13_2_2_1_4,
    q13_2_2_1_5,
    q13_2_2_1_6,
    q13_2_2_1_7,
  );
  const q13_2_2 = new CompositionQuestion<ID, ErrorType>(
    '13_2_2',
    getQuestionContent('question13_2_2'),
    q13_2_2_1,
  );

  const q13_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_3',
    getQuestionContent('question13_2_3'),
    0,
  );
  const q13_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_4',
    getQuestionContent('question13_2_4'),
    0,
  );
  const q13_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_5',
    getQuestionContent('question13_2_5'),
    0,
  );
  const q13_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_6',
    getQuestionContent('question13_2_6'),
    0,
  );
  const q13_2_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_7',
    getQuestionContent('question13_2_7'),
    0,
  );
  const q13_2_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_8',
    getQuestionContent('question13_2_8'),
    0,
  );
  const q13_2_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_9',
    getQuestionContent('question13_2_9'),
    0,
  );
  const q13_2_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_10',
    getQuestionContent('question13_2_10'),
    0,
  );

  const q13_2: SpecializedGroup<
    ID,
    ErrorType,
    QuestionAnswerNode<ID, number, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, QuestionAnswerNode<ID, number, ErrorType>>(
    '13_2',
    getQuestionContent('question13_2'),
    q13_2_1,
    q13_2_2,
    q13_2_3,
    q13_2_4,
    q13_2_5,
    q13_2_6,
    q13_2_7,
    q13_2_8,
    q13_2_9,
    q13_2_10,
  );

  const q13: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '13',
    getQuestionContent('question13'),
    q13_1,
    q13_2,
  );

  // Question 14
  const q14_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_1',
    getQuestionContent('question14_1_1'),
    0,
  );
  const q14_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_2',
    getQuestionContent('question14_1_2'),
    0,
  );
  const q14_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_3',
    getQuestionContent('question14_1_3'),
    0,
  );
  const q14_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_4',
    getQuestionContent('question14_1_4'),
    0,
  );
  const q14_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_5',
    getQuestionContent('question14_1_5'),
    0,
  );
  const q14_1_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_6',
    getQuestionContent('question14_1_6'),
    0,
  );
  const q14_1_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_8',
    getQuestionContent('question14_1_7'),
    0,
  );
  const q14_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_1',
    getQuestionContent('question14_1'),
    q14_1_1,
    q14_1_2,
    q14_1_3,
    q14_1_4,
    q14_1_5,
    q14_1_6,
    q14_1_7,
  );

  const q14_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_1',
    getQuestionContent('question14_2_1'),
    0,
  );
  const q14_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_2',
    getQuestionContent('question14_2_2'),
    0,
  );
  const q14_2: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_2',
    getQuestionContent('question14_2'),
    q14_2_1,
    q14_2_2,
  );

  const q14_3_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_1',
    getQuestionContent('question14_3_1'),
    0,
  );
  const q14_3_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_2',
    getQuestionContent('question14_3_2'),
    0,
    // q13_2_2_1,
  );
  const q14_3_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_3',
    getQuestionContent('question14_3_3'),
    0,
  );
  const q14_3_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_4',
    getQuestionContent('question14_3_4'),
    0,
  );
  const q14_3_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_5',
    getQuestionContent('question14_3_5'),
    0,
  );
  const q14_3_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_6',
    getQuestionContent('question14_3_6'),
    0,
  );
  const q14_3_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_7',
    getQuestionContent('question14_3_7'),
    0,
  );
  const q14_3_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_8',
    getQuestionContent('question14_3_8'),
    0,
  );
  const q14_3_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_9',
    getQuestionContent('question14_3_9'),
    0,
  );
  const q14_3_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_10',
    getQuestionContent('question14_3_10'),
    0,
  );
  const q14_3: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_3',
    getQuestionContent('question14_3'),
    q14_3_1,
    q14_3_2,
    q14_3_3,
    q14_3_4,
    q14_3_5,
    q14_3_6,
    q14_3_7,
    q14_3_8,
    q14_3_9,
    q14_3_10,
  );

  const q14: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '14',
    getQuestionContent('question14'),
    q14_1,
    q14_2,
    q14_3,
  );

  rehabReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14);
  rehabReport.addBreakpoints(0, 4, 7, 11, 12, 13);

  return rehabReport;
};

export const buildMaternityMockReport = (): QuestionGroup<ID, ErrorType> => {
  const getQuestionContent = (questionKey: string) => {
    return {
      en: translations['en'].maternityQuestions[questionKey],
      fr: translations['fr'].maternityQuestions[questionKey],
    };
  };

  const reportID: ID = 'maternity-report_1';
  const maternityReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(reportID, {
    en: 'Maternity Report',
    fr: 'Rapport de maternité',
  });

  // Questions 1 to 5
  const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '1',
    getQuestionContent('question1'),
  );
  const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '2',
    getQuestionContent('question2'),
  );
  const q3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '3',
    getQuestionContent('question3'),
  );
  const q4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '4',
    getQuestionContent('question4'),
  );
  const q5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '5',
    getQuestionContent('question5'),
  );

  // Question 6 "Died before 48h"
  const q6: ExpandableQuestion<ID, ErrorType> = new ExpandableQuestion<ID, ErrorType>(
    '6',
    getQuestionContent('question6'),
    questionIdGeneratorBuilder('6'),
  );
  const q6_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '6_1',
    getQuestionContent('question6_1'),
  );
  const q6_2: TextQuestion<ID, ErrorType> = new TextQuestion<ID, ErrorType>(
    '6_2',
    getQuestionContent('question6_2'),
  );
  q6.addAllToTemplate(q6_1, q6_2);

  // Question 7 "Died after 48h"
  const q7: ExpandableQuestion<ID, ErrorType> = new ExpandableQuestion<ID, ErrorType>(
    '7',
    getQuestionContent('question7'),
    questionIdGeneratorBuilder('7'),
  );
  const q7_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '7_1',
    getQuestionContent('question7_1'),
  );
  const q7_2: TextQuestion<ID, ErrorType> = new TextQuestion<ID, ErrorType>(
    '7_2',
    getQuestionContent('question7_2'),
  );
  q7.addAllToTemplate(q7_1, q7_2);

  // Questions 8 to 10
  const q8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '8',
    getQuestionContent('question8'),
  );
  const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '9',
    getQuestionContent('question9'),
  );
  const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '10',
    getQuestionContent('question10'),
  );

  // Question 11 "Self-discharged"
  const q11: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '11',
    getQuestionContent('question11'),
  );

  // 11_1 "Reason for self-discharged"
  const q11_1: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    '11_1',
    getQuestionContent('question11_1'),
  );
  const q11_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_1',
    getQuestionContent('question11_1_1'),
  );
  const q11_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_2',
    getQuestionContent('question11_1_2'),
  );
  const q11_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_3',
    getQuestionContent('question11_1_3'),
  );
  const q11_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_4',
    getQuestionContent('question11_1_4'),
  );
  const q11_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_5',
    getQuestionContent('question11_1_5'),
  );
  q11_1.addAll(q11_1_1, q11_1_2, q11_1_3, q11_1_4, q11_1_5);
  // TODO: add q11_1 to q11

  // Question 12
  const q12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12',
    getQuestionContent('question12'),
  );

  // Question 13 "Admissions"
  const q13: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '11',
    getQuestionContent('question13'),
  );

  // 13_1 "Where do patients come from?"
  const q13_1: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    '11_3',
    getQuestionContent('question11_3'),
  );
  const q13_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_3_1',
    getQuestionContent('question11_3_1'),
  );
  const q13_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_3_2',
    getQuestionContent('question11_3_2'),
  );
  const q13_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_3_3',
    getQuestionContent('question11_3_3'),
  );
  const q13_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_3_4',
    getQuestionContent('question11_3_4'),
  );
  q13_1.addAll(q13_1_1, q13_1_2, q13_1_3, q13_1_4);
  // TODO: add q13_1 to q13

  // Question 14 Table
  // const q14_rows: string[] = ['Weight <1.5kg', '1.5kg ≤ Weight <2.5kg', '2.5kg and over', 'Not weighed'];
  // const q14_columns: string[] = ['Births', 'Normal', 'Césarienne', 'Instrumentalsé'];
  // TODO: Create question table
  //const q14: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>('Deliveries', '14', q14_rows, q14_columns, () => NumericQuestion<ID, ErrorType>);

  maternityReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13);
  return maternityReport;
};

export const buildCommunityHealthMockReport = (): QuestionGroup<ID, ErrorType> => {
  //report ID
  const reportID: ID = 'community_health_report';
  const CommunityHealthReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    reportID,
    { en: 'Maternity Report', fr: 'Rapport de maternité' },
  );

  return CommunityHealthReport;
};
