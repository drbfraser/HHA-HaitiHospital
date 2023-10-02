import {
  CompositionQuestion,
  ExpandableQuestion,
  MultipleSelectionQuestion,
  NumericQuestion,
  NumericTable,
  QuestionGroup,
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
  const report: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('ROOT', {
    en: 'OneQuestionReport',
    fr: 'test',
  });
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
    getQuestionContent('question13_2_1'),
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

export const buildNicuPaedsMockReport = (): QuestionGroup<ID, ErrorType> => {
  const reportID: ID = 'nicu-paeds-report_1';
  const nicuPaedsReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(reportID, {
    en: 'MSPP Data',
    fr: 'Données MSPP',
  });

  // Questions 1 to 3
  const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('1', {
    en: 'Beds available',
    fr: 'Lits disponibles',
  });
  const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('2', {
    en: 'Bed days',
    fr: 'Jours-lit',
  });
  const q3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('3', {
    en: 'Patient days',
    fr: 'Jours-patient',
  });

  // Question 4 "Hospitalized"
  const q4_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '4_1_1',
    {
      en: 'Hospitalized NICU',
      fr: 'Hospitalisé NICU',
    },
    0,
  );
  const q4_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '4_1_2',
    {
      en: 'Hospitalised Paed',
      fr: 'Hospitalisé Paed',
    },
    0,
  );
  const q4_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '4_1',
    {
      en: 'Departments',
      fr: 'Départements',
    },
    q4_1_1,
    q4_1_2,
  );
  const q4: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '4',
    {
      en: 'Hospitalized',
      fr: 'Hospitalisé',
    },
    q4_1,
  );

  // Question 5 "Discharged alive"
  const q5_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '5_1_1',
    {
      en: '# Discharged from NICU',
      fr: '# Déchargé de NICU',
    },
    0,
  );
  const q5_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '5_1_2',
    {
      en: '# Discharged from elsewhere',
      fr: "# Déchargé d'ailleurs",
    },
    0,
  );
  const q5_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '5_1',
    {
      en: 'By Department',
      fr: 'Par Département',
    },
    q5_1_1,
    q5_1_2,
  );
  const q5: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '5',
    {
      en: 'Discharged Alive',
      fr: 'Déchargé Vivant',
    },
    q5_1,
  );

  // Question 6 "Died before 48h"
  const q6_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '6_1_1',
    {
      en: 'Died in NICU',
      fr: 'Décédé en NICU',
    },
    0,
  );
  const q6_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '6_1_2',
    {
      en: 'Died in Paed',
      fr: 'Décédé en Pédiatrie',
    },
    0,
  );
  const q6_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '6_1',
    {
      en: 'By Department',
      fr: 'Par Département',
    },
    q6_1_1,
    q6_1_2,
  );
  const q6: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '6',
    {
      en: 'Died before 48h',
      fr: 'Décédé avant 48h',
    },
    q6_1,
  );

  // Question 7 "Died after 48h"
  const q7_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '7_1_1',
    {
      en: 'Died in NICU',
      fr: 'Décédé en NICU',
    },
    0,
  );
  const q7_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '7_1_2',
    {
      en: 'Died in Paed',
      fr: 'Décédé en Pédiatrie',
    },
    0,
  );
  const q7_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '7_1',
    {
      en: 'By Department',
      fr: 'Par Département',
    },
    q7_1_1,
    q7_1_2,
  );
  const q7: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '7',
    {
      en: 'Died after 48h',
      fr: 'Décédé après 48h',
    },
    q7_1,
  );

  // Questions 8 to 10
  const q8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('8', {
    en: 'Days hospitalised',
    fr: 'Jours hospitalisés',
  });
  const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('9', {
    en: 'Referrals',
    fr: 'Références',
  });
  const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>('10', {
    en: 'Transfers',
    fr: 'Transferts',
  });

  const q11_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_1',
    {
      en: 'Finance: Leave as cannot afford care',
      fr: 'Finances: Partir car incapable de payer les soins',
    },
    0,
  );
  const q11_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_2',
    {
      en: 'Finance: Left to avoid paying',
      fr: 'Finances: Parti pour éviter de payer',
    },
    0,
  );
  const q11_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_3',
    {
      en: 'Religious/Cultural',
      fr: 'Religieuse/Culturelle',
    },
    0,
  );
  const q11_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_4',
    {
      en: 'Personal/ Family',
      fr: 'Personnelle/ Familiale',
    },
    0,
  );
  const q11_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_5',
    {
      en: 'Other',
      fr: 'Autre',
    },
    0,
  );

  const q11_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '11_1',
    {
      en: 'Reason for self-discharge',
      fr: "Raison de l'auto-décharge",
    },
    q11_1_1,
    q11_1_2,
    q11_1_3,
    q11_1_4,
    q11_1_5,
  );

  const q11: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '11',
    {
      en: 'Self-discharged',
      fr: 'PSA',
    },
    q11_1,
  );

  // Question 12
  const q12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12',
    {
      en: 'Stayed in the ward',
      fr: "Séjour à l'hôpital",
    },
    0,
  );

  const q13_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_1',
    {
      en: 'Quarter Morin',
      fr: 'Quartier Morin',
    },
    0,
  );
  const q13_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_2',
    {
      en: 'Cap Haitian',
      fr: 'Cap Haïtien',
    },
    0,
  );
  const q13_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_3',
    {
      en: 'Department Nord',
      fr: 'Département du Nord',
    },
    0,
  );
  const q13_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_4',
    {
      en: 'Other departments',
      fr: 'Autres départements',
    },
    0,
  );

  const q13_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_1',
    {
      en: 'Where do patients come from?',
      fr: "D'où viennent les patients?",
    },
    q13_1_1,
    q13_1_2,
    q13_1_3,
    q13_1_4,
  );

  const q13_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_1',
    {
      en: 'Extremely preterm (less than 28 weeks)',
      fr: 'Extrêmement prématuré (moins de 28 semaines)',
    },
    0,
  );
  const q13_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_2',
    {
      en: 'Very preterm (28 to 32 weeks)',
      fr: 'Très prématuré (28 à 32 semaines)',
    },
    0,
  );
  const q13_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_3',
    {
      en: 'Moderate to late preterm (32 to 37 weeks)',
      fr: 'Prématuré modéré à tardif (32 à 37 semaines)',
    },
    0,
  );
  const q13_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_4',
    {
      en: 'Full term (37 weeks plus)',
      fr: 'À terme (37 semaines et plus)',
    },
    0,
  );
  const q13_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_5',
    {
      en: 'Older than neonate (>4 weeks old)',
      fr: 'Plus âgé que le nouveau-né (> 4 semaines)',
    },
    0,
  );
  const q13_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_6',
    {
      en: 'Age 4 weeks - 5',
      fr: 'Âge de 4 semaines - 5',
    },
    0,
  );
  const q13_2_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_7',
    {
      en: 'Age 6-11',
      fr: 'Âge 6-11',
    },
    0,
  );
  const q13_2_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_2_8',
    {
      en: 'Age 12-18',
      fr: 'Âge 12-18',
    },
    0,
  );

  const q13_2: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_2',
    {
      en: 'Age of infant admitted',
      fr: 'Âge du nourrisson admis',
    },
    q13_2_1,
    q13_2_2,
    q13_2_3,
    q13_2_4,
    q13_2_5,
    q13_2_6,
    q13_2_7,
    q13_2_8,
  );

  // 13_3 "Gender"
  const q13_3_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_3_1',
    {
      en: 'Male',
      fr: 'Masculin',
    },
    0,
  );
  const q13_3_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_3_2',
    {
      en: 'Female',
      fr: 'Féminin',
    },
    0,
  );

  const q13_3: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_3',
    {
      en: 'Gender',
      fr: 'Gendre',
    },
    q13_3_1,
    q13_3_2,
  );

  const q13_4_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_1',
    {
      en: 'Respiratory arrest',
      fr: 'Arrêt respiratoire',
    },
    0,
  );
  const q13_4_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_2',
    {
      en: 'Traumatic injury',
      fr: 'Blessure traumatique',
    },
    0,
  );
  const q13_4_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_3',
    {
      en: 'Septic Shock',
      fr: 'Choc septique',
    },
    0,
  );
  const q13_4_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_4',
    {
      en: 'Hypovolemic shock',
      fr: 'Choc hypovolémique',
    },
    0,
  );
  const q13_4_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_5',
    {
      en: 'Seizures/convulsions',
      fr: 'Crises/convulsions',
    },
    0,
  );
  const q13_4_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_6',
    {
      en: 'Poisoning',
      fr: 'Empoisonnement',
    },
    0,
  );
  const q13_4_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_7',
    {
      en: 'Altered mental status',
      fr: 'État mental altéré',
    },
    0,
  );
  const q13_4_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_8',
    {
      en: 'Gastroenteritis',
      fr: 'Gastro-entérite',
    },
    0,
  );
  const q13_4_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_9',
    {
      en: 'Hemorrhage',
      fr: 'Hémorragie',
    },
    0,
  );
  const q13_4_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_10',
    {
      en: 'Hypothermia',
      fr: 'Hypothermie',
    },
    0,
  );
  const q13_4_11: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_11',
    {
      en: 'Cardiac congenital anomaly',
      fr: 'Anomalie congénitale cardiaque',
    },
    0,
  );
  const q13_4_12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_12',
    {
      en: 'Other congenital anomaly',
      fr: 'Autre anomalie congénitale',
    },
    0,
  );
  const q13_4_13: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_13',
    {
      en: 'Malnutrition',
      fr: 'Malnutrition',
    },
    0,
  );
  const q13_4_14: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_14',
    {
      en: 'Meningitis',
      fr: 'Méningite',
    },
    0,
  );
  const q13_4_15: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_15',
    {
      en: 'Community acquired pneumonia',
      fr: 'Pneumonie communautaire acquise',
    },
    0,
  );
  const q13_4_16: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_16',
    {
      en: 'Aspiration pneumonia',
      fr: 'Pneumonie par aspiration',
    },
    0,
  );
  const q13_4_17: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_17',
    {
      en: 'Moderate prematurity (32-36 weeks gestation)',
      fr: 'Prématurité modérée (32-36 semaines de gestation)',
    },
    0,
  );
  const q13_4_18: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_18',
    {
      en: 'Severe prematurity (<32 weeks)',
      fr: 'Prématurité sévère (<32 semaines)',
    },
    0,
  );
  const q13_4_19: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_4_19',
    {
      en: 'Other',
      fr: 'Autre',
    },
    0,
  );

  const q13_4: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '13_4',
    {
      en: 'Main condition',
      fr: 'Condition principale',
    },
    q13_4_1,
    q13_4_2,
    q13_4_3,
    q13_4_4,
    q13_4_5,
    q13_4_6,
    q13_4_7,
    q13_4_8,
    q13_4_9,
    q13_4_10,
    q13_4_11,
    q13_4_12,
    q13_4_13,
    q13_4_14,
    q13_4_15,
    q13_4_16,
    q13_4_17,
    q13_4_18,
    q13_4_19,
  );

  const q13: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '13',
    {
      en: 'Admissions',
      fr: 'Admissions',
    },
    q13_1,
    q13_2,
    q13_3,
    q13_4,
  );

  const q14_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_1',
    {
      en: 'Extremely preterm (less than 28 weeks)',
      fr: 'Extrêmement prématuré (moins de 28 semaines)',
    },
    0,
  );
  const q14_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_2',
    {
      en: 'Very preterm (28 to 32 weeks)',
      fr: 'Très prématuré (28 à 32 semaines)',
    },
    0,
  );
  const q14_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_3',
    {
      en: 'Moderate to late preterm (32 to 37 weeks)',
      fr: 'Prématuré modéré à tardif (32 à 37 semaines)',
    },
    0,
  );
  const q14_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_4',
    {
      en: 'Full term (37 weeks plus)',
      fr: 'À terme (37 semaines et plus)',
    },
    0,
  );
  const q14_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_5',
    {
      en: 'Older than neonate (>4 weeks old)',
      fr: 'Plus âgé que le nouveau-né (> 4 semaines)',
    },
    0,
  );
  const q14_1_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_6',
    {
      en: 'Age 4 weeks -5',
      fr: 'Âge de 4 semaines -5',
    },
    0,
  );
  const q14_1_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_7',
    {
      en: 'Age 6-11',
      fr: 'Âge 6-11',
    },
    0,
  );
  const q14_1_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_1_8',
    {
      en: 'Age 12-18',
      fr: 'Âge 12-18',
    },
    0,
  );

  const q14_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_1',
    {
      en: 'Age',
      fr: 'Âge',
    },
    q14_1_1,
    q14_1_2,
    q14_1_3,
    q14_1_4,
    q14_1_5,
    q14_1_6,
    q14_1_7,
    q14_1_8,
  );

  const q14_2_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_1',
    {
      en: 'Respiratory arrest',
      fr: 'Arrêt respiratoire',
    },
    0,
  );
  const q14_2_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_2',
    {
      en: 'Traumatic injury',
      fr: 'Blessure traumatique',
    },
    0,
  );
  const q14_2_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_3',
    {
      en: 'Septic Shock',
      fr: 'Choc septique',
    },
    0,
  );
  const q14_2_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_4',
    {
      en: 'Hypovolemic shock',
      fr: 'Choc hypovolémique',
    },
    0,
  );
  const q14_2_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_5',
    {
      en: 'Seizures/convulsions',
      fr: 'Crises/convulsions',
    },
    0,
  );
  const q14_2_6: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_6',
    {
      en: 'Poisoning',
      fr: 'Empoisonnement',
    },
    0,
  );
  const q14_2_7: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_7',
    {
      en: 'Altered mental status',
      fr: 'État mental altéré',
    },
    0,
  );
  const q14_2_8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_8',
    {
      en: 'Gastroenteritis',
      fr: 'Gastro-entérite',
    },
    0,
  );
  const q14_2_9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_9',
    {
      en: 'Hemorrhage',
      fr: 'Hémorragie',
    },
    0,
  );
  const q14_2_10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_10',
    {
      en: 'Hypothermia',
      fr: 'Hypothermie',
    },
    0,
  );
  const q14_2_11: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_11',
    {
      en: 'Cardiac congenital anomaly',
      fr: 'Anomalie congénitale cardiaque',
    },
    0,
  );
  const q14_2_12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_12',
    {
      en: 'Other congenital anomaly',
      fr: 'Autre anomalie congénitale',
    },
    0,
  );
  const q14_2_13: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_13',
    {
      en: 'Malnutrition',
      fr: 'Malnutrition',
    },
    0,
  );
  const q14_2_14: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_14',
    {
      en: 'Meningitis',
      fr: 'Méningite',
    },
    0,
  );
  const q14_2_15: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_15',
    {
      en: 'Community acquired pneumonia',
      fr: 'Pneumonie communautaire acquise',
    },
    0,
  );
  const q14_2_16: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_16',
    {
      en: 'Aspiration pneumonia',
      fr: 'Pneumonie par aspiration',
    },
    0,
  );
  const q14_2_17: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_17',
    {
      en: 'Moderate prematurity (32-36 weeks gestation)',
      fr: 'Prématurité modérée (32-36 semaines de gestation)',
    },
    0,
  );
  const q14_2_18: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_18',
    {
      en: 'Severe prematurity (<32 weeks)',
      fr: 'Prématurité sévère (<32 semaines)',
    },
    0,
  );
  const q14_2_19: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_2_19',
    {
      en: 'Other',
      fr: 'Autre',
    },
    0,
  );

  const q14_2: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_2',
    {
      en: 'Main condition',
      fr: 'Condition principale',
    },
    q14_2_1,
    q14_2_2,
    q14_2_3,
    q14_2_4,
    q14_2_5,
    q14_2_6,
    q14_2_7,
    q14_2_8,
    q14_2_9,
    q14_2_10,
    q14_2_11,
    q14_2_12,
    q14_2_13,
    q14_2_14,
    q14_2_15,
    q14_2_16,
    q14_2_17,
    q14_2_18,
    q14_2_19,
  );

  const q14_3_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_1',
    {
      en: 'Male',
      fr: 'Homme',
    },
    0,
  );
  const q14_3_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '14_3_2',
    {
      en: 'Female',
      fr: 'Femme',
    },
    0,
  );

  const q14_3: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '14_3',
    {
      en: 'Gender',
      fr: 'Genre',
    },
    q14_3_1,
    q14_3_2,
  );

  const q14: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '14',
    {
      en: 'Number of outpatients',
      fr: 'Nombre de patients externes',
    },
    q14_1,
    q14_2,
    q14_3,
  );

  nicuPaedsReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14);
  return nicuPaedsReport;
};

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
    '13',
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
  const q14_rows: string[] = [
    'Weight <1.5kg',
    '1.5kg ≤ Weight <2.5kg',
    '2.5kg and over',
    'Not weighed',
  ];
  const q14_columns: string[] = ['Births', 'Normal', 'Césarienne', 'Instrumentalsé', 'test'];

  const q14: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '14',
    { en: 'Question 14', fr: 'Question 14 (French)' },
    q14_rows,
    q14_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q14_${row}_${col}`, {
        en: `Question for ${q14_rows[row]} and ${q14_columns[col]}`,
        fr: `Question pour ${q14_rows[row]} et ${q14_columns[col]} (French)`,
      }),
  );

  // Create a NumericTable for q 14
  // Above code is giving the null for the questionTable

  maternityReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14);
  return maternityReport;
};

export const buildCommunityHealthMockReport = (): QuestionGroup<ID, ErrorType> => {
  const communityhealthReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    'ROOT',
    { en: 'Mock Report', fr: 'Rapport fictif' },
  );

  const q1_rows: string[] = [
    '< 15 years',
    '15-19 years',
    '20-24 years',
    '25-29 years',
    '30 years plus',
    'Unknown',
  ];

  const q1_columns: string[] = ['Age of Mothers', 'Matrones formèes', 'Autres'];

  // Create the NumericTable
  const q1: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '1',
    { en: 'Question 1', fr: 'Question 1 (French)' },
    q1_rows,
    q1_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q1_${row}_${col}`, {
        en: `Question for ${q1_rows[row]} and ${q1_columns[col]}`,
        fr: `Question pour ${q1_rows[row]} et ${q1_columns[col]} (French)`,
      }),
  );

  const q2_rows: string[] = [
    'Weight <1.5kg',
    '1.5kg ≤ Weight <2.5kg',
    '2.5kg and over',
    'Not weighed',
    'Immediately breastfed',
    'Skin to skin therapy',
  ];

  const q2_columns: string[] = ['Births', 'Matrones', 'Autres'];

  // Create the NumericTable
  const q2: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '2',
    { en: 'Question 2', fr: 'Question 2 (French)' },
    q2_rows,
    q2_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q2_${row}_${col}`, {
        en: `Question for ${q2_rows[row]} and ${q2_columns[col]}`,
        fr: `Question pour ${q2_rows[row]} et ${q2_columns[col]} (French)`,
      }),
  );

  const q3_rows: string[] = [
    'Breastfeeding women receiving vitamin A',
    'Breastfeeding women with MUAC <210mm',
    'Breastfeeding women with malnutrition support',
    'Domestic visits in 0-3 days',
  ];

  const q3_columns: string[] = ['Post Natal', 'Matrones', 'Autres'];

  const q3: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '3',
    { en: 'Question 3', fr: 'Question 3 (French)' },
    q3_rows,
    q3_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q3_${row}_${col}`, {
        en: `Question for ${q3_rows[row]} and ${q3_columns[col]}`,
        fr: `Question pour ${q3_rows[row]} et ${q3_columns[col]} (French)`,
      }),
  );

  const q4_rows: string[] = [
    'Methods/ Sex',
    '?? OCP',
    '?? Patch',
    'Depo injection',
    'Implant',
    'Inter uterine devices (IUD)',
    'Vaginal ring',
    'Breastfeeding as birth control',
    'Female condom',
    'Sterilisation',
    'Male condom',
    'Vasectomy',
    '',
    'Quantity (number)',
    'Sterilisation',
    'Vasectomy',
  ];

  const q4_columns: string[] = [
    'Birth Control',
    'Acceptants <25 ans',
    'Acceptants 25 ans et plus',
    'Total utilisateurs <25 ans',
    'Total utilisateurs 25 ans et plus',
    'Unité',
    'Quantité',
    'Nbre de jours rupture de stocks/ mois',
  ];

  // Create the NumericTable
  const q4: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '4',
    { en: 'Question 4', fr: 'Question 4 (French)' },
    q4_rows,
    q4_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q4_${row}_${col}`, {
        en: `Question for ${q4_rows[row]} and ${q4_columns[col]}`,
        fr: `Question pour ${q4_rows[row]} et ${q4_columns[col]} (French)`,
      }),
  );

  const q5_rows: string[] = [
    'BCG',
    'VPO',
    'Penta',
    'Rota',
    'RR',
    'dT',
    'VPI',
    'Pneumo',
    'DTP',
    'COVID-19',
  ];

  const q5_columns: string[] = [
    'Type of Vaccine',
    'Quantité disponible au cours du mois',
    'Balance en fin de mois',
    'Nombre de jours de rupture de stocks',
  ];

  // Create the NumericTable
  const q5: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '5',
    { en: 'Question 5', fr: 'Question 5 (French)' },
    q5_rows,
    q5_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q5_${row}_${col}`, {
        en: `Question for ${q5_rows[row]} and ${q5_columns[col]}`,
        fr: `Question pour ${q5_rows[row]} et ${q5_columns[col]} (French)`,
      }),
  );

  const q6_rows: string[] = [
    'SAB 0.05ml',
    'SAB 0.5ml',
    'Sdil_2ml',
    'Sdil_5ml',
    'Boîtes Séc',
    'Coton',
  ];

  const q6_columns: string[] = [
    'Consumables',
    'Quantité disponible au cours du mois',
    'Balance en fin de mois',
    'Nombre de jours de rupture de stocks',
  ];

  // Create the NumericTable
  const q6: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '6',
    { en: 'Question 6', fr: 'Question 6 (French)' },
    q6_rows,
    q6_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q6_${row}_${col}`, {
        en: `Question for ${q6_rows[row]} and ${q6_columns[col]}`,
        fr: `Question pour ${q6_rows[row]} et ${q6_columns[col]} (French)`,
      }),
  );

  const q7_rows: string[] = [
    'BCG',
    'VPO (Polio)',
    'VPO 1 (Polio)',
    'VPO 2 (Polio)',
    'Rappel VPO (Polio)',
    'VPI',
    'Penta 1',
    'Penta 2',
    'Penta 3',
    'Rota 1',
    'Rota 2',
    'RR 1',
    'RR 2',
    'Pneumo 1',
    'Pneumo 2',
    'Pneumo 3',
    'DTp Rappel',
    'ECV',
  ];

  const q7_columns: string[] = [
    '0-11 Mois Inst.',
    '0-11 Mois Comm.',
    '12-32 Mois Inst.',
    '12-32 Mois Comm.',
    '0-11 Mois Inst.',
    '0-11 Mois Comm.',
    '12-23 Mois Inst.',
    '12-23 Mois Comm.',
    'Utilisées Inst.',
    'Utilisées Comm.',
    'Administrées Inst.',
    'Administrées Comm.',
  ];

  // Create the NumericTable
  const q7: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '7',
    { en: 'Question 7', fr: 'Question 7 (French)' },
    q7_rows,
    q7_columns,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q7_${row}_${col}`, {
        en: `Question for ${q7_rows[row]} and ${q7_columns[col]}`,
        fr: `Question pour ${q7_rows[row]} et ${q7_columns[col]} (French)`,
      }),
  );

  // Add Age of Mothers table to the report
  communityhealthReport.addAll(q1, q2, q3, q4, q5, q6, q7);

  return communityhealthReport;
};
