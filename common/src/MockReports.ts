import {
  CompositionQuestion,
  ExpandableQuestion,
  MultipleSelectionQuestion,
  NumericQuestion,
  NumericTable,
  QuestionGroup,
  QuestionTable,
  SingleSelectionQuestion,
  SpecializedGroup,
  TextQuestion,
} from './Questions';
import { QuestionAnswerNode } from './Questions/QuestionAnswer';

type ID = string;
type ErrorType = string;

const questionIdGeneratorBuilder =
  (questionId: ID) =>
    (questionGroupIndex: number): ID =>
      `${questionId}_${questionGroupIndex}`;

export const oneQuestionMockReport = (): QuestionGroup<ID, ErrorType> => {
  const report: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    'ROOT',
    { en: 'OneQuestionReport', fr: 'test' },
  );
  const q1 = new TextQuestion<ID, ErrorType>('1', { en: 'What is your name?', fr: 'test' });
  report.add(q1);

  return report;
};

export const buildRehabMockReport = (): QuestionGroup<ID, ErrorType> => {

  const translations = {
    en: require('../src/locales/en/translationEN.json'),
    fr: require('../src/locales/fr/translationFR.json'),
  };

  const getQuestionContent = (questionKey: string) => {
    return {
      en: translations['en'].rehabReportQuestions[questionKey],
      fr: translations['fr'].rehabReportQuestions[questionKey],
    };
  };

  console.log('Here is the buildRehabMockReport');
  const reportID: ID = 'rehab-report_1_1';

  const rehabReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    reportID,
    { en: 'Rehab Report', fr: 'Rapport de Rehab' },
  );


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
  >(
    '5_6',
    getQuestionContent('question5_6'),
    ['Wheelchair', 'Walker', 'Cane', 'Crutches'],
    [],
  );
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
  const q6_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('6_2', getQuestionContent('question6_2'));
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
  const q7_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('7_2', getQuestionContent('question7_2'));
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
  /* UNUSED
  const q11_1: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>('11_1', 'Reason for self-discharge', [
    'Finance: Left as cannot afford care',
    'Finance: Left to avoid paying',
    'Religious/Cultural',
    'Personal/Family',
    'Other'
  ]);*/

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

  const q13_2_1_1_1 = new NumericQuestion<ID, ErrorType>('13_2_1_1_1', getQuestionContent('question13_2_1_1_1'), 0);
  const q13_2_1_1_2 = new NumericQuestion<ID, ErrorType>('13_2_1_1_2', getQuestionContent('question13_2_1_1_2'), 0);
  const q13_2_1_1_3 = new NumericQuestion<ID, ErrorType>('13_2_1_1_3', getQuestionContent('question13_2_1_1_3'), 0);
  const q13_2_1_1_4 = new NumericQuestion<ID, ErrorType>('13_2_1_1_4', getQuestionContent('question13_2_1_1_4'), 0);
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
  const q13_2_1_1_7 = new NumericQuestion<ID, ErrorType>('13_2_1_1_7', getQuestionContent('question13_2_1_1_7'), 0);
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
  const q13_2_1 = new CompositionQuestion<ID, ErrorType>('13_2_1', getQuestionContent('question13_2_1_1'), q13_2_1_1);

  const q13_2_2_1_1 = new NumericQuestion<ID, ErrorType>('13_2_2_1_1', getQuestionContent('question13_2_2_1_1'), 0);
  const q13_2_2_1_2 = new NumericQuestion<ID, ErrorType>('13_2_2_1_2', getQuestionContent('question13_2_2_1_2'), 0);
  const q13_2_2_1_3 = new NumericQuestion<ID, ErrorType>('13_2_2_1_3', getQuestionContent('question13_2_2_1_3'), 0);
  const q13_2_2_1_4 = new NumericQuestion<ID, ErrorType>('13_2_2_1_4', getQuestionContent('question13_2_2_1_4'), 0);
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
  const q13_2_2_1_7 = new NumericQuestion<ID, ErrorType>('13_2_2_1_7', getQuestionContent('question13_2_2_1_7'), 0);
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
  const q13_2_2 = new CompositionQuestion<ID, ErrorType>('13_2_2', getQuestionContent('question13_2_2'), q13_2_2_1);

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

// export const buildNicuPaedsMockReport = (): QuestionGroup<ID, ErrorType> => {
//   const reportID: ID = 'nicu-paeds-report_1';
//   const nicuPaedsReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     'MSPP Data',
//     reportID,
//   );

//   // Questions 1 to 3
//   const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '1',
//     'Beds available',
//   );
//   const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('2', 'Beds days');
//   const q3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '3',
//     'Patient days',
//   );

//   // Question 4 "Hospitalized"
//   const q4_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '4_1_1',
//     'Hospitalized NICU',
//   );
//   const q4_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '4_1_2',
//     'Hospitalised Paed',
//   );
//   const q4_1: SpecializedGroup<
//     ID,
//     ErrorType,
//     NumericQuestion<ID, ErrorType>
//   > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
//     '4_1',
//     'Departments',
//     q4_1_1,
//     q4_1_2,
//   );
//   const q4: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '4',
//     'Hospitalized',
//     q4_1,
//   );

//   // Question 5 "Discharged alive"
//   const q5_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '5_1_1',
//     '# Discharged from NICU',
//   );
//   const q5_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '5_1_2',
//     '# Discharged from elsewhere',
//   );
//   const q5_1: SpecializedGroup<
//     ID,
//     ErrorType,
//     NumericQuestion<ID, ErrorType>
//   > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
//     '5_1',
//     'By Department',
//     q5_1_1,
//     q5_1_2,
//   );
//   const q5: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '5',
//     'Discharged Alive',
//     q5_1,
//   );

//   // Question 6 "Died before 48h"
//   const q6_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '6_1_1',
//     'Died in NICU',
//   );
//   const q6_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '6_1_2',
//     'Died in Paed',
//   );
//   const q6_1: SpecializedGroup<
//     ID,
//     ErrorType,
//     NumericQuestion<ID, ErrorType>
//   > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
//     '6_1',
//     'By Department',
//     q6_1_1,
//     q6_1_2,
//   );
//   const q6: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '6',
//     'Died before 48h',
//     q6_1,
//   );

//   // Question 7 "Died after 48h"
//   const q7_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '7_1_1',
//     'Died in NICU',
//   );
//   const q7_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '7_1_2',
//     'Died in Paed',
//   );
//   const q7_1: SpecializedGroup<
//     ID,
//     ErrorType,
//     NumericQuestion<ID, ErrorType>
//   > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
//     '7_1',
//     'By Department',
//     q7_1_1,
//     q7_1_2,
//   );
//   const q7: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '7',
//     'Died after 48h',
//     q7_1,
//   );

//   // Questions 8 to 10
//   const q8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '8',
//     'Days hospitalised',
//   );
//   const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('9', 'Referrals');
//   const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('10', 'Transfers');

//   // Question 11 "Self-discharged"
//   const q11: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '11',
//     'Reason for self-discharge',
//   );

//   // 11_1 "Reason for self-discharge"
//   const q11_1: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     '11_1',
//     'Reason for self-discharge (Group 1)',
//   );
//   const q11_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '11_1_1',
//     'Finance: Leave as cannot afford care',
//   );
//   const q11_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '11_1_2',
//     'Finance: Left to avoid paying',
//   );
//   const q11_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '11_1_3',
//     'Religious/Cultural',
//   );
//   const q11_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '11_1_4',
//     'Personal/ Family',
//   );
//   const q11_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '11_1_5',
//     'Other',
//   );
//   q11_1.addAll(q11_1_1, q11_1_2, q11_1_3, q11_1_4, q11_1_5);
//   // TODO: Add q11_1 to q11

//   // Question 12
//   const q12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '12',
//     'Stayed in the ward',
//   );

//   // Question 13 "Admissions"
//   const q13: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '13',
//     'Where do patients come from?',
//   );

//   // 13_1 "Where do patients come from?"
//   const q13_1: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     '13_1',
//     'Where do patients come from? (Group 1)',
//   );
//   const q13_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_1_1',
//     'Quarter Morin',
//   );
//   const q13_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_1_2',
//     'Cap Haitian',
//   );
//   const q13_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_1_3',
//     'Department Nord',
//   );
//   const q13_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_1_4',
//     'Other departments',
//   );
//   q13_1.addAll(q13_1_1, q13_1_2, q13_1_3, q13_1_4);
//   // TODO: Add q13_1 to q13

//   // 13_2 "Age of infant admitted"
//   const q13_2: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     '13_2',
//     'Age of infant admitted',
//   );
//   const q13_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_1',
//     'Extremely preterm (less than 28 weeks)',
//   );
//   const q13_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_2',
//     'Very preterm (28 to 32 weeks)',
//   );
//   const q13_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_3',
//     'Moderate to late preterm (32 to 37 weeks)',
//   );
//   const q13_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_4',
//     'Full term (37 weeks plus)',
//   );
//   const q13_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_5',
//     'Older than neonate (>4 weeks old)',
//   );
//   const q13_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_6',
//     'Age 4 weeks -5',
//   );
//   const q13_2_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_7',
//     'Age 6-11',
//   );
//   const q13_2_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_2_8',
//     'Age 12-18',
//   );
//   q13_2.addAll(q13_2_1, q13_2_2, q13_2_3, q13_2_4, q13_2_5, q13_2_6, q13_2_7, q13_2_8);
//   // TODO: Add q13_2 to q13

//   // 13_3 "Gender"
//   // const q13_3: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('Gender', '13_3');
//   const q13_3_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_3_1',
//     'Male',
//   );
//   const q13_3_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_3_2',
//     'Female',
//   );
//   q13_1.addAll(q13_3_1, q13_3_2);
//   // TODO: Add q13_3 to q13

//   // 13_4 "Main Condition"
//   const q13_4: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     '13_4',
//     'Main condition',
//   );
//   const q13_4_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_1',
//     'Respiratory arrest',
//   );
//   const q13_4_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_2',
//     'Traumatic injury',
//   );
//   const q13_4_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_3',
//     'Septic Shock',
//   );
//   const q13_4_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_4',
//     'Hypovolemic shock',
//   );
//   const q13_4_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_5',
//     'Seizures/convulsions',
//   );
//   const q13_4_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_6',
//     'Poisoning',
//   );
//   const q13_4_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_7',
//     'Altered mental status',
//   );
//   const q13_4_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_8',
//     'Gastroenteritis',
//   );
//   const q13_4_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_9',
//     'Hemorrhage',
//   );
//   const q13_4_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_10',
//     'Hypothermia',
//   );
//   const q13_4_11: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_11',
//     'Cardiac congenital anomaly',
//   );
//   const q13_4_12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_12',
//     'Other congenital anomaly',
//   );
//   const q13_4_13: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_13',
//     'Malnutrition',
//   );
//   const q13_4_14: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_14',
//     'Meningitis',
//   );
//   const q13_4_15: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_15',
//     'Community acquired pneumonia',
//   );
//   const q13_4_16: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_16',
//     'Aspiration pneumonia',
//   );
//   const q13_4_17: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_17',
//     'Moderate prematurity (32-36 weeks gestation)',
//   );
//   const q13_4_18: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_18',
//     'Severe prematurity (<32 weeks)',
//   );
//   const q13_4_19: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '13_4_19',
//     'Other',
//   );
//   q13_4.addAll(
//     q13_4_1,
//     q13_4_2,
//     q13_4_3,
//     q13_4_4,
//     q13_4_5,
//     q13_4_6,
//     q13_4_7,
//     q13_4_8,
//     q13_4_9,
//     q13_4_10,
//     q13_4_11,
//     q13_4_12,
//     q13_4_13,
//     q13_4_14,
//     q13_4_15,
//     q13_4_16,
//     q13_4_17,
//     q13_4_18,
//     q13_4_19,
//   );
//   // TODO: Add q13_4 to q13

//   // Question 14 "Number of outpatients"
//   const q14: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
//     '14',
//     'Number of outpatients',
//   );

//   // 14_1 "Age"
//   const q14_1: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('14_1', 'Age');
//   const q14_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_1,',
//     'Extremely preterm (less than 28 weeks)',
//   );
//   const q14_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_2,',
//     'Very preterm (28 to 32 weeks)',
//   );
//   const q14_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_3,',
//     'Moderate to late preterm (32 to 37 weeks)',
//   );
//   const q14_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_4,',
//     'Full term (37 weeks plus)',
//   );
//   const q14_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_5,',
//     'Older than neonate (>4 weeks old)',
//   );
//   const q14_1_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_6,',
//     'Age 4 weeks -5',
//   );
//   const q14_1_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_7,',
//     'Age 6-11',
//   );
//   const q14_1_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_1_8,',
//     'Age 12-18',
//   );
//   q14_1.addAll(q14_1_1, q14_1_2, q14_1_3, q14_1_4, q14_1_5, q14_1_6, q14_1_7, q14_1_8);

//   // TODO: Add q14_1 to q14

//   // 14_2 "Main Condition"
//   const q14_2: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
//     '14_2',
//     'Main condition',
//   );
//   const q14_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_1',
//     'Respiratory arrest',
//   );
//   const q14_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_2',
//     'Traumatic injury',
//   );
//   const q14_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_3',
//     'Septic Shock',
//   );
//   const q14_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_4',
//     'Hypovolemic shock',
//   );
//   const q14_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_5',
//     'Seizures/convulsions',
//   );
//   const q14_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_6',
//     'Poisoning',
//   );
//   const q14_2_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_7',
//     'Altered mental status',
//   );
//   const q14_2_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_8',
//     'Gastroenteritis',
//   );
//   const q14_2_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_9',
//     'Hemorrhage',
//   );
//   const q14_2_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_10',
//     'Hypothermia',
//   );
//   const q14_2_11: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_11',
//     'Cardiac congenital anomaly',
//   );
//   const q14_2_12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_12',
//     'Other congenital anomaly',
//   );
//   const q14_2_13: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_13',
//     'Malnutrition',
//   );
//   const q14_2_14: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_14',
//     'Meningitis',
//   );
//   const q14_2_15: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_15',
//     'Community acquired pneumonia',
//   );
//   const q14_2_16: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_16',
//     'Aspiration pneumonia',
//   );
//   const q14_2_17: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_17',
//     'Moderate prematurity (32-36 weeks gestation)',
//   );
//   const q14_2_18: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_18',
//     'Severe prematurity (<32 weeks)',
//   );
//   const q14_2_19: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_2_19',
//     'Other',
//   );
//   q14_2.addAll(
//     q14_2_1,
//     q14_2_2,
//     q14_2_3,
//     q14_2_4,
//     q14_2_5,
//     q14_2_6,
//     q14_2_7,
//     q14_2_8,
//     q14_2_9,
//     q14_2_10,
//     q14_2_11,
//     q14_2_12,
//     q14_2_13,
//     q14_2_14,
//     q14_2_15,
//     q14_2_16,
//     q14_2_17,
//     q14_2_18,
//     q14_2_19,
//   );
//   // TODO: Add q14_2 to q14

//   // 14_3 "Gender"
//   const q14_3: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('14_3', 'Gender');
//   const q14_3_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_3_1',
//     'Male',
//   );
//   const q14_3_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
//     '14_3_2',
//     'Female',
//   );
//   q14_3.addAll(q14_3_1, q14_3_2);
//   // TODO: Add q14_3 to q14

//   nicuPaedsReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14);
//   return nicuPaedsReport;
// };

export const buildMaternityMockReport = (): QuestionGroup<ID, ErrorType> => {

  const translations = {
    en: require('../src/locales/en/translationEN.json'),
    fr: require('../src/locales/fr/translationFR.json'),
  };

  const getQuestionContent = (questionKey: string) => {
    return {
      en: translations['en'].maternityQuestions[questionKey],
      fr: translations['fr'].maternityQuestions[questionKey],
    };
  };

  const reportID: ID = 'maternity-report_1';
  const maternityReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    reportID,
    { en: 'Maternity Report', fr: 'Rapport de maternité' },
  );

  // Questions 1 to 5
  const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '1',
    getQuestionContent('question1'),
  );
  const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('2', getQuestionContent('question2'));
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
  const q6_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('6_1', getQuestionContent('question6_1'));
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
  const q7_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('7_1', getQuestionContent('question7_1'));
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
  const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('9', getQuestionContent('question9'));
  const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('10', getQuestionContent('question10'));

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



// type Translation = Record<string, string>;
// // Create a concrete implementation of QuestionTable
// class CommunityHealthTable extends QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> {
//   constructor(
//     id: ID,
//     prompt: Translation,
//     rowHeaders: string[],
//     columnHeaders: string[],
//     questionCreator: (row: number, col: number) => NumericQuestion<ID, ErrorType> | undefined,
//   ) {
//     super(id, prompt, rowHeaders, columnHeaders, questionCreator);
//   }
// }

// export const buildCommunityHealthMockReport = (): QuestionGroup<ID, ErrorType> => {
//   // Table: Age of Mothers
//   const ageOfMothersTable = new CommunityHealthTable(
//     'ageOfMothersTable',
//     { en: 'Age of Mothers', fr: 'Age des mères' },
//     ['< 15 years', '15-19 years', '20-24 years', '25-29 years', '30 years plus', 'Unknown'], // Row Headers
//     ['Matrones formèes', 'Autres'], // Column Headers
//     (row: number, col: number) => new NumericQuestion<ID, ErrorType>(`ageOfMothers_${row}_${col}`, {}),
//   );

//   // Table: Naissances (Births)
//   const naissancesTable = new CommunityHealthTable(
//     'naissancesTable',
//     { en: 'Births', fr: 'Naissances' },
//     ['Poids <1.5kg', '1.5kg ≤ Poids <2.5kg', '2.5kg et plus', 'Non pesées', 'Milses au sein immédiatement', 'Bénéficiares de méthode Kangourou'], // Row Headers
//     ['Matrones formèes', 'Autres'], // Column Headers
//     (row: number, col: number) => new NumericQuestion<ID, ErrorType>(`naissances_${row}_${col}`, {}),
//   );

//   // Table: Suivi Post Natal (Post Natal)
//   const suiviPostNatalTable = new CommunityHealthTable(
//     'suiviPostNatalTable',
//     { en: 'Post Natal', fr: 'Suivi Post Natal' },
//     ['Femmes allaitantes recevant de la vitamine A', 'Femmes allaitantes avec PB <210mm', 'Femmes allaitantes avec MAM/MAS prises en charge', 'Visites domicllaries 0-3 jours'], // Row Headers
//     [], // Column Headers
//     (row: number, col: number) => new NumericQuestion<ID, ErrorType>(`suiviPostNatal_${row}_${col}`, {}),
//   );

//   // Creating the Question Group and adding the tables to it
//   const communityHealthGroup = new QuestionGroup<ID, ErrorType>({ en: 'Community Health', fr: 'Santé Communautaire' });
//   communityHealthGroup.addChild(ageOfMothersTable);
//   communityHealthGroup.addChild(naissancesTable);
//   communityHealthGroup.addChild(suiviPostNatalTable);

//   return communityHealthGroup;
// };


export const buildCommunityHealthMockReport = (): QuestionGroup<ID, ErrorType> => {
  const communityhealthReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    'ROOT',
    { en: 'Mock Report', fr: 'Rapport fictif' },
  );

  // Table: Deliveries
  const deliveriesTable: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    'deliveriesTable',
    { en: 'Deliveries', fr: 'Accouchements' },
    ['Age des mères', 'Matrones formées', 'Autres'],
    ['<15 ans', '15-19 ans', '20-24 ans', '25-29 ans', '30 ans et plus', 'Inconnu'],
    (row, col) => new NumericQuestion<ID, ErrorType>(`question${row}-${col}`, { en: '', fr: '' }),
  );

  // Add questions to Age of Mothers table
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question1', { en: '< 15 ans', fr: '< 15 ans' }));
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question2', { en: '15-19 ans', fr: '15-19 ans' }));
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question3', { en: '20-24 ans', fr: '20-24 ans' }));
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question4', { en: '25-29 ans', fr: '25-29 ans' }));
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question5', { en: '30 ans et plus', fr: '30 ans et plus' }));
  deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question6', { en: 'Inconnu', fr: 'Inconnu' }));

  // Add Age of Mothers table to the report
  communityhealthReport.add(deliveriesTable);

  // // Table: Deliveries
  // const deliveriesTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'deliveriesTable',
  //   { en: 'Deliveries', fr: 'Accouchments' },
  //   ['Age des méres', 'Matrones formèes', 'Autres'],
  //   ['<15 ans', '15-19 ans', '20-24 ans', '25-29 ans', '30 ans et plus', 'Inconnu'],
  // );

  // // Add questions to Age of Mothers table
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question1', { en: '< 15 ans', fr: '< 15 ans' }));
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question2', { en: '15-19 ans', fr: '15-19 ans' }));
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question3', { en: '20-24 ans', fr: '20-24 ans' }));
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question4', { en: '25-29 ans', fr: '25-29 ans' }));
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question5', { en: '30 ans et plus', fr: '30 ans et plus' }));
  // deliveriesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question6', { en: 'Inconnu', fr: 'Inconnu' }));

  // // Add Age of Mothers table to the report
  // report.add(deliveriesTable);

  // // Table: Naissances
  // const birthsTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'birthsTable',
  //   { en: 'Naissances', fr: 'Births' },
  //   ['Poids <1.5kg', '1.5kg ≤ Poids <2.5kg', '2.5kg et plus', 'Non pesées', 'Milses au sein immédiatement', 'Bénéficares de méthode Kangourou'],
  //   ['Matrones', 'Autres'],
  // );

  // // Add questions to Naissances table
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question7', { en: 'Poids <1.5kg', fr: 'Poids <1.5kg' }));
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question8', { en: '1.5kg ≤ Poids <2.5kg', fr: '1.5kg ≤ Poids <2.5kg' }));
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question9', { en: '2.5kg et plus', fr: '2.5kg et plus' }));
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question10', { en: 'Non pesées', fr: 'Non pesées' }));
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question11', { en: 'Milses au sein immédiatement', fr: 'Milses au sein immédiatement' }));
  // birthsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question12', { en: 'Bénéficares de méthode Kangourou', fr: 'Bénéficares de méthode Kangourou' }));

  // // Add Naissances table to the report
  // report.add(birthsTable);

  // // Table: Suivi Post Natal
  // const suiviPostNatalTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'suiviPostNatalTable',
  //   { en: 'Suivi Post Natal', fr: 'Post Natal' },
  //   ['Femmes allaitantes recevant de la vitamine A', 'Femmes allaitantes avec PB <210mm', 'Femmes allaitantes avec MAM/MAS prises en charge', 'Visites domicllaries 0-3 jours'],
  //   ['Matrones', 'Autres'],
  // );

  // // Add questions to Suivi Post Natal table
  // suiviPostNatalTable.addQuestion(new NumericQuestion<ID, ErrorType>('question13', { en: 'Femmes allaitantes recevant de la vitamine A', fr: 'Femmes allaitantes recevant de la vitamine A' }));
  // suiviPostNatalTable.addQuestion(new NumericQuestion<ID, ErrorType>('question14', { en: 'Femmes allaitantes avec PB <210mm', fr: 'Femmes allaitantes avec PB <210mm' }));
  // suiviPostNatalTable.addQuestion(new NumericQuestion<ID, ErrorType>('question15', { en: 'Femmes allaitantes avec MAM/MAS prises en charge', fr: 'Femmes allaitantes avec MAM/MAS prises en charge' }));
  // suiviPostNatalTable.addQuestion(new NumericQuestion<ID, ErrorType>('question16', { en: 'Visites domicllaries 0-3 jours', fr: 'Visites domicllaries 0-3 jours' }));

  // // Add Suivi Post Natal table to the report
  // report.add(suiviPostNatalTable);

  // // Table: Contraceptifs distribués
  // const contraceptifsTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'contraceptifsTable',
  //   { en: 'Contraceptifs distribués', fr: 'Contraceptifs distribués' },
  //   ['Mèthodes/ Sexe', '<25 ans', '25 ans et plus'],
  //   ['?? OCP', '?? Patch', 'Dépoprovera', 'Implant', 'DIU (stèrilet)', 'Collier', 'MAMA', 'Condom', 'Ligature', 'Vasectomie'],
  // );

  // // Add questions to Contraceptifs distribués table
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question17', { en: '?? OCP', fr: '?? OCP' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question18', { en: '?? Patch', fr: '?? Patch' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question19', { en: 'Dépoprovera', fr: 'Dépoprovera' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question20', { en: 'Implant', fr: 'Implant' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question21', { en: 'DIU (stèrilet)', fr: 'DIU (stèrilet)' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question22', { en: 'Collier', fr: 'Collier' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question23', { en: 'MAMA', fr: 'MAMA' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question24', { en: 'Condom', fr: 'Condom' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question25', { en: 'Ligature', fr: 'Ligature' }));
  // contraceptifsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question26', { en: 'Vasectomie', fr: 'Vasectomie' }));

  // // Add Contraceptifs distribués table to the report
  // report.add(contraceptifsTable);

  // // Table: Gestion des vaccins & Consommables
  // const gestionVaccinsTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'gestionVaccinsTable',
  //   { en: 'Gestion des vaccins & Consommables', fr: 'Vaccines and consumables' },
  //   ['Antigène', 'Type of Vaccine', 'Quantité disponible au cours du mois', 'Balance en fin de mois', 'Nombre de jours de rupture de stocks'],
  // );

  // // Add questions to Gestion des vaccins & Consommables table
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question27', { en: 'BCG', fr: 'BCG' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question28', { en: 'VPO', fr: 'VPO' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question29', { en: 'Penta', fr: 'Penta' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question30', { en: 'Rota', fr: 'Rota' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question31', { en: 'RR', fr: 'RR' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question32', { en: 'dT', fr: 'dT' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question33', { en: 'VPI', fr: 'VPI' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question34', { en: 'Pneumo', fr: 'Pneumo' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question35', { en: 'DTP', fr: 'DTP' }));
  // gestionVaccinsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question36', { en: 'COVID-19', fr: 'COVID-19' }));

  // // Add Gestion des vaccins & Consommables table to the report
  // report.add(gestionVaccinsTable);

  // // Table: Intrants
  // const intrantsTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'intrantsTable',
  //   { en: 'Intrants', fr: 'Consumables' },
  //   ['SAB 0.05ml', 'SAB 0.5ml', 'Sdil_2ml', 'Sdil_5ml', 'Boîtes Séc', 'Coton'],
  // );

  // // Add questions to Intrants table
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question37', { en: 'SAB 0.05ml', fr: 'SAB 0.05ml' }));
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question38', { en: 'SAB 0.5ml', fr: 'SAB 0.5ml' }));
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question39', { en: 'Sdil_2ml', fr: 'Sdil_2ml' }));
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question40', { en: 'Sdil_5ml', fr: 'Sdil_5ml' }));
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question41', { en: 'Boîtes Séc', fr: 'Boîtes Séc' }));
  // intrantsTable.addQuestion(new NumericQuestion<ID, ErrorType>('question42', { en: 'Coton', fr: 'Coton' }));

  // // Add Intrants table to the report
  // report.add(intrantsTable);

  // // Table: Vaccination
  // const vaccinationTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'vaccinationTable',
  //   { en: 'Vaccination', fr: 'Vaccination' },
  //   ['Vaccins', '0-11 Mois', '12-32 Mois', '0-11 mois', '12-23 mois'],
  //   ['Inst.', 'Comm.', 'Inst.', 'Comm.', 'Inst.', 'Comm.', 'Inst.', 'Comm.', 'Utilisées', 'Administrées'],
  // );

  // // Add questions to Vaccination table
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question43', { en: 'BCG', fr: 'BCG' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question44', { en: 'VPO (Polio)', fr: 'VPO (Polio)' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question45', { en: 'VPO 1 (Polio)', fr: 'VPO 1 (Polio)' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question46', { en: 'VPO 2 (Polio)', fr: 'VPO 2 (Polio)' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question47', { en: 'Rappel VPO (Polio)', fr: 'Rappel VPO (Polio)' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question48', { en: 'VPI', fr: 'VPI' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question49', { en: 'Penta 1', fr: 'Penta 1' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question50', { en: 'Penta 2', fr: 'Penta 2' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question51', { en: 'Penta 3', fr: 'Penta 3' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question52', { en: 'Rota 1', fr: 'Rota 1' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question53', { en: 'Rota 2', fr: 'Rota 2' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question54', { en: 'RR 1', fr: 'RR 1' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question55', { en: 'RR 2', fr: 'RR 2' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question56', { en: 'Pneumo 1', fr: 'Pneumo 1' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question57', { en: 'Pneumo 2', fr: 'Pneumo 2' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question58', { en: 'Pneumo 3', fr: 'Pneumo 3' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question59', { en: 'DTp Rappel', fr: 'DTp Rappel' }));
  // vaccinationTable.addQuestion(new NumericQuestion<ID, ErrorType>('question60', { en: 'ECV', fr: 'ECV' }));

  // // Add Vaccination table to the report
  // report.add(vaccinationTable);

  // // Table: Vaccin Femmes Enceintes
  // const vaccinFemmesEnceintesTable: QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>> = new QuestionTable<ID, number, ErrorType, NumericQuestion<ID, ErrorType>>(
  //   'vaccinFemmesEnceintesTable',
  //   { en: 'Vaccin Femmes Enceintes', fr: 'Vaccin Femmes Enceintes' },
  //   ['Inst.', 'Comm.', 'Total', 'Doses Vaccins'],
  // );

  // // Add questions to Vaccin Femmes Enceintes table
  // vaccinFemmesEnceintesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question61', { en: 'dT1', fr: 'dT1' }));
  // vaccinFemmesEnceintesTable.addQuestion(new NumericQuestion<ID, ErrorType>('question62', { en: 'dT2+', fr: 'dT2+' }));

  // // Add Vaccin Femmes Enceintes table to the report
  // report.add(vaccinFemmesEnceintesTable);

  return communityhealthReport;
};
