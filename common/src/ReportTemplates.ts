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
type Translation = Record<string, string>;
type maskIndex = [number, number];
type cellIndices = Array<maskIndex>;

function createTableGreyMask(rows: number, cols: number, greyIndices?: maskIndex[]): boolean[][] {
  // Create a mask with all values set to false
  const mask: boolean[][] = new Array(rows).fill(null).map(() => new Array(cols).fill(false));

  // If greyIndices is provided, set the specified cells to true
  if (greyIndices) {
    greyIndices.forEach(([row, col]) => {
      if (mask[row] !== undefined) {
        if (mask[row]![col] !== undefined) {
          mask[row]![col] = true;
        }
      }
    });
  }
  return mask;
}

const separateLanguages = (translations: Translation[]): { en: string[]; fr: string[] } => {
  const en: string[] = [];
  const fr: string[] = [];

  for (const translation of translations) {
    en.push(translation.en || '');
    fr.push(translation.fr || '');
  }

  return { en, fr };
};

const questionIdGeneratorBuilder =
  (questionId: ID) =>
  (questionGroupIndex: number): ID =>
    `${questionId}_${questionGroupIndex}`;

export const oneQuestionReport = (): QuestionGroup<ID, ErrorType> => {
  const report: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>('ROOT', {
    en: 'OneQuestionReport',
    fr: 'test',
  });
  const q1 = new TextQuestion<ID, ErrorType>('1', { en: 'What is your name?', fr: 'test' });
  report.add(q1);

  return report;
};

export const buildRehabReport = (): QuestionGroup<ID, ErrorType> => {
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

  console.log('Here is the buildRehabReport');
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
    [
      { en: 'SCI', fr: 'SCI' },
      { en: 'Stroke', fr: 'Accident vasculaire cérébral' },
      { en: 'Other', fr: 'Autre' },
    ],
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
      { en: 'All goals met', fr: 'Tous les objectifs atteints' },
      {
        en: 'Goals partially met, sufficient for discharge',
        fr: 'Objectifs partiellement atteints, suffisants pour la décharge',
      },
      {
        en: 'Goals not met, discharged for alternate reason',
        fr: 'Objectifs non atteints, renvoyé pour une autre raison',
      },
    ],
    0,
  );
  const q5_4: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_4',
    getQuestionContent('question5_4'),
    [
      { en: 'Independent', fr: 'Indépendant' },
      { en: 'Modified Independent', fr: 'Indépendant modifié' },
      { en: 'Supervision', fr: 'Surveillance' },
      { en: 'Minimum Assistance', fr: 'Assistance minimale' },
      { en: 'Moderate Assistance', fr: 'Assistance modérée' },
      { en: 'Maximum Assistance', fr: 'Assistance maximale' },
      { en: 'Dependent', fr: 'Dépendant' },
    ],
    0,
  );
  const q5_5: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_5',
    getQuestionContent('question5_5'),
    [
      { en: 'Independent', fr: 'Indépendant' },
      { en: 'Modified Independent', fr: 'Indépendant modifié' },
      { en: 'Supervision', fr: 'Surveillance' },
      { en: 'Minimum Assistance', fr: 'Assistance minimale' },
      { en: 'Moderate Assistance', fr: 'Assistance modérée' },
      { en: 'Maximum Assistance', fr: 'Assistance maximale' },
      { en: 'Dependent', fr: 'Dépendant' },
    ],
    0,
  );
  const q5_6: MultipleSelectionQuestion<ID, ErrorType> = new MultipleSelectionQuestion<
    ID,
    ErrorType
  >(
    '5_6',
    getQuestionContent('question5_6'),
    [
      { en: 'Wheelchair', fr: 'Fauteuil roulant' },
      { en: 'Walker', fr: 'Marcheur' },
      { en: 'Cane', fr: 'Canne' },
      { en: 'Crutches', fr: 'Béquilles' },
      { en: 'None', fr: 'Aucun' },
    ],
    [],
  );
  const q5_7: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_7',
    getQuestionContent('question5_7'),
    [
      { en: 'Return home, alone', fr: 'Retourner à la maison, seul' },
      {
        en: 'Return home, with family/caregiver(s)',
        fr: 'Retourner à la maison, avec la famille/les aidants',
      },
      { en: 'Admitted to hospital', fr: "Admis à l'hôpital" },
    ],
    0,
  );
  const q5_8: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '5_8',
    getQuestionContent('question5_8'),
    [
      { en: 'Employed', fr: 'Employé' },
      { en: 'Unemployed, unable to find work', fr: 'Sans emploi, incapable de trouver du travail' },
      { en: 'Unemployed, due to condition', fr: 'Sans emploi, en raison de la condition' },
      {
        en: 'Retired, not working due to age',
        fr: "Retraité, ne travaille pas en raison de l'âge",
      },
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
    [
      { en: 'SCI', fr: 'SCI' },
      { en: 'CVA', fr: 'CVA' },
      { en: 'Other', fr: 'Autre' },
    ],
  );
  const q6_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '6_2',
    getQuestionContent('question6_2'),
  );
  const q6_3: SingleSelectionQuestion<ID, ErrorType> = new SingleSelectionQuestion<ID, ErrorType>(
    '6_3',
    getQuestionContent('question6_3'),
    [{ en: 'Suspected CVA', fr: 'CVA suspecté' }],
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
    [
      { en: 'SCI', fr: 'SCI' },
      { en: 'CVA', fr: 'CVA' },
      { en: 'Other', fr: 'Autre' },
    ],
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

  // 11_1 "Reason for self-discharged"

  const q11_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_1',
    getQuestionContent('question11_1_option1'),
  );
  const q11_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_2',
    getQuestionContent('question11_1_option2'),
  );
  const q11_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_3',
    getQuestionContent('question11_1_option3'),
  );
  const q11_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_4',
    getQuestionContent('question11_1_option4'),
  );
  const q11_1_5: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '11_1_5',
    getQuestionContent('question11_1_option5'),
  );

  const q11_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '11_1',
    getQuestionContent('question11_1'),
    q11_1_1,
    q11_1_2,
    q11_1_3,
    q11_1_4,
    q11_1_5,
  );

  // Question 11 "Self-discharged"
  const q11: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '11',
    getQuestionContent('question11'),
    q11_1,
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
  const q12_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12_1_4',
    getQuestionContent('question12_1_4'),
    0,
  );
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
    q12_1_4,
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

export const buildNicuPaedsReport = (): QuestionGroup<ID, ErrorType> => {
  const reportID: ID = 'nicu-paeds-report_1';
  const nicuPaedsReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(reportID, {
    en: 'NICU/Paeds Report ',
    fr: 'Rapport de NICU/Paeds',
  });

  // Questions 1 to 3
  const q1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '1',
    {
      en: 'Beds available',
      fr: 'Lits disponibles',
    },
    0,
  );
  const q2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '2',
    {
      en: 'Bed days',
      fr: 'Jours-lit',
    },
    0,
  );
  const q3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '3',
    {
      en: 'Patient days',
      fr: 'Jours-patient',
    },
    0,
  );

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
  const q8: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '8',
    {
      en: 'Days hospitalised',
      fr: 'Jours hospitalisés',
    },
    0,
  );
  const q9: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '9',
    {
      en: 'Referrals',
      fr: 'Références',
    },
    0,
  );
  const q10: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '10',
    {
      en: 'Transfers',
      fr: 'Transferts',
    },
    0,
  );

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
  nicuPaedsReport.addBreakpoints(0, 4, 7, 11, 13);

  return nicuPaedsReport;
};

export const buildMaternityReport = (): QuestionGroup<ID, ErrorType> => {
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

  // 11_1 "Reason for self-discharged"

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

  const q11_1: SpecializedGroup<
    ID,
    ErrorType,
    NumericQuestion<ID, ErrorType>
  > = new SpecializedGroup<ID, ErrorType, NumericQuestion<ID, ErrorType>>(
    '11_1',
    getQuestionContent('question11_1'),
    q11_1_1,
    q11_1_2,
    q11_1_3,
    q11_1_4,
    q11_1_5,
  );

  // Question 11 "Self-discharged"
  const q11: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '11',
    getQuestionContent('question11'),
    q11_1,
  );

  // Question 12
  const q12: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '12',
    getQuestionContent('question12'),
  );

  const q13_1_1: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_1',
    getQuestionContent('question13_1_1'),
  );
  const q13_1_2: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_2',
    getQuestionContent('question13_1_2'),
  );
  const q13_1_3: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_3',
    getQuestionContent('question13_1_3'),
  );
  const q13_1_4: NumericQuestion<ID, ErrorType> = new NumericQuestion<ID, ErrorType>(
    '13_1_4',
    getQuestionContent('question13_1_4'),
  );
  // 13_1 "Where do patients come from?"
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

  // Question 13 "Admissions"
  const q13: CompositionQuestion<ID, ErrorType> = new CompositionQuestion<ID, ErrorType>(
    '13',
    getQuestionContent('question13'),
    q13_1,
  );

  // Question 14 Table

  const q14_rows: Translation[] = [
    getQuestionContent('question14_row_1'),
    getQuestionContent('question14_row_2'),
    getQuestionContent('question14_row_3'),
    getQuestionContent('question14_row_4'),
  ];

  const q14_columns: Translation[] = [
    getQuestionContent('question14_col_1'),
    getQuestionContent('question14_col_2'),
    getQuestionContent('question14_col_3'),
    getQuestionContent('question14_col_4'),
  ];

  const q14_table_title: Translation = getQuestionContent('question14_title');

  const q14_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q14_rows.length,
    q14_columns.length,
  );

  const { en: q14_rows_en, fr: q14_rows_fr } = separateLanguages(q14_rows);
  const { en: q14_columns_en, fr: q14_columns_fr } = separateLanguages(q14_columns);

  // Create the NumericTable
  const q14: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '14',
    { en: 'Question 14', fr: 'Question 14 (French)' },
    q14_rows,
    q14_columns,
    q14_table_title,
    q14_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q14_${row}_${col}`, {
        en: `Question for ${q14_rows_en[row]} and ${q14_columns_en[col]}`,
        fr: `Question pour ${q14_rows_fr[row]} et ${q14_columns_fr[col]}`,
      }),
  );

  // Question 15 Table

  const q15_rows: Translation[] = [
    getQuestionContent('question15_row_1'),
    getQuestionContent('question15_row_2'),
    getQuestionContent('question15_row_3'),
    getQuestionContent('question15_row_4'),
  ];

  const q15_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q15_table_title: Translation = getQuestionContent('question15_title');

  const q15_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q15_rows.length,
    q15_columns.length,
  );

  const { en: q15_rows_en, fr: q15_rows_fr } = separateLanguages(q15_rows);
  const { en: q15_columns_en, fr: q15_columns_fr } = separateLanguages(q15_columns);

  // Create the NumericTable
  const q15: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '15',
    { en: 'Question 15', fr: 'Question 15 (French)' },
    q15_rows,
    q15_columns,
    q15_table_title,
    q15_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q15_${row}_${col}`, {
        en: `Question for ${q15_rows_en[row]} and ${q15_columns_en[col]}`,
        fr: `Question pour ${q15_rows_fr[row]} et ${q15_columns_fr[col]}`,
      }),
  );

  // Question 16 Table

  const q16_rows: Translation[] = [
    getQuestionContent('question16_row_1'),
    getQuestionContent('question16_row_2'),
  ];

  const q16_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q16_table_title: Translation = getQuestionContent('question16_title');

  const q16_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q16_rows.length,
    q16_columns.length,
  );

  const { en: q16_rows_en, fr: q16_rows_fr } = separateLanguages(q16_rows);
  const { en: q16_columns_en, fr: q16_columns_fr } = separateLanguages(q16_columns);

  // Create the NumericTable
  const q16: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '16',
    { en: 'Question 16', fr: 'Question 16 (French)' },
    q16_rows,
    q16_columns,
    q16_table_title,
    q16_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q16_${row}_${col}`, {
        en: `Question for ${q16_rows_en[row]} and ${q16_columns_en[col]}`,
        fr: `Question pour ${q16_rows_fr[row]} et ${q16_columns_fr[col]}`,
      }),
  );

  // Question 17 Table

  const q17_rows: Translation[] = [
    getQuestionContent('question17_row_1'),
    getQuestionContent('question17_row_2'),
  ];

  const q17_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q17_table_title: Translation = getQuestionContent('question17_title');

  const q17_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q17_rows.length,
    q17_columns.length,
  );

  const { en: q17_rows_en, fr: q17_rows_fr } = separateLanguages(q17_rows);
  const { en: q17_columns_en, fr: q17_columns_fr } = separateLanguages(q17_columns);

  // Create the NumericTable
  const q17: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '17',
    { en: 'Question 17', fr: 'Question 17 (French)' },
    q17_rows,
    q17_columns,
    q17_table_title,
    q17_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q17_${row}_${col}`, {
        en: `Question for ${q17_rows_en[row]} and ${q17_columns_en[col]}`,
        fr: `Question pour ${q17_rows_fr[row]} et ${q17_columns_fr[col]}`,
      }),
  );

  // Question 18 Table

  const q18_rows: Translation[] = [
    getQuestionContent('question18_row_1'),
    getQuestionContent('question18_row_2'),
  ];

  const q18_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q18_table_title: Translation = getQuestionContent('question18_title');

  const q18_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q18_rows.length,
    q18_columns.length,
  );

  const { en: q18_rows_en, fr: q18_rows_fr } = separateLanguages(q18_rows);
  const { en: q18_columns_en, fr: q18_columns_fr } = separateLanguages(q18_columns);

  // Create the NumericTable
  const q18: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '18',
    { en: 'Question 18', fr: 'Question 18 (French)' },
    q18_rows,
    q18_columns,
    q18_table_title,
    q18_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q18_${row}_${col}`, {
        en: `Question for ${q18_rows_en[row]} and ${q18_columns_en[col]}`,
        fr: `Question pour ${q18_rows_fr[row]} et ${q18_columns_fr[col]}`,
      }),
  );

  // Question 19 Table

  const q19_rows: Translation[] = [
    getQuestionContent('question19_row_1'),
    getQuestionContent('question19_row_2'),
    getQuestionContent('question19_row_3'),
    getQuestionContent('question19_row_4'),
  ];

  const q19_columns: Translation[] = [
    getQuestionContent('question19_col_1'),
    getQuestionContent('question19_col_2'),
    getQuestionContent('question19_col_3'),
    getQuestionContent('question19_col_4'),
    getQuestionContent('question19_col_5'),
    getQuestionContent('question19_col_6'),
  ];

  const q19_table_title: Translation = getQuestionContent('question19_title');

  const q19_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q19_rows.length,
    q19_columns.length,
  );

  const { en: q19_rows_en, fr: q19_rows_fr } = separateLanguages(q19_rows);
  const { en: q19_columns_en, fr: q19_columns_fr } = separateLanguages(q19_columns);

  // Create the NumericTable
  const q19: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '19',
    { en: 'Question 19', fr: 'Question 19 (French)' },
    q19_rows,
    q19_columns,
    q19_table_title,
    q19_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q19_${row}_${col}`, {
        en: `Question for ${q19_rows_en[row]} and ${q19_columns_en[col]}`,
        fr: `Question pour ${q19_rows_fr[row]} et ${q19_columns_fr[col]}`,
      }),
  );

  // Question 20 Table

  const q20_rows: Translation[] = [
    getQuestionContent('question20_row_1'),
    getQuestionContent('question20_row_2'),
    getQuestionContent('question20_row_3'),
    getQuestionContent('question20_row_4'),
    getQuestionContent('question20_row_5'),
    getQuestionContent('question20_row_6'),
    getQuestionContent('question20_row_7'),
    getQuestionContent('question20_row_8'),
    getQuestionContent('question20_row_9'),
  ];

  const q20_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q20_table_title: Translation = getQuestionContent('question20_title');

  const q20_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q20_rows.length,
    q20_columns.length,
  );

  const { en: q20_rows_en, fr: q20_rows_fr } = separateLanguages(q20_rows);
  const { en: q20_columns_en, fr: q20_columns_fr } = separateLanguages(q20_columns);

  // Create the NumericTable
  const q20: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '20',
    { en: 'Question 20', fr: 'Question 20 (French)' },
    q20_rows,
    q20_columns,
    q20_table_title,
    q20_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q20_${row}_${col}`, {
        en: `Question for ${q20_rows_en[row]} and ${q20_columns_en[col]}`,
        fr: `Question pour ${q20_rows_fr[row]} et ${q20_columns_fr[col]}`,
      }),
  );

  // Question 21 Table

  const q21_rows: Translation[] = [
    getQuestionContent('question21_row_1'),
    getQuestionContent('question21_row_2'),
    getQuestionContent('question21_row_3'),
    getQuestionContent('question21_row_4'),
    getQuestionContent('question21_row_5'),
  ];

  const q21_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q21_table_title: Translation = getQuestionContent('question21_title');

  const q21_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q21_rows.length,
    q21_columns.length,
  );

  const { en: q21_rows_en, fr: q21_rows_fr } = separateLanguages(q21_rows);
  const { en: q21_columns_en, fr: q21_columns_fr } = separateLanguages(q21_columns);

  // Create the NumericTable
  const q21: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '21',
    { en: 'Question 21', fr: 'Question 21 (French)' },
    q21_rows,
    q21_columns,
    q21_table_title,
    q21_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q21_${row}_${col}`, {
        en: `Question for ${q21_rows_en[row]} and ${q21_columns_en[col]}`,
        fr: `Question pour ${q21_rows_fr[row]} et ${q21_columns_fr[col]}`,
      }),
  );

  // Question 22 Table

  const q22_rows: Translation[] = [
    getQuestionContent('question22_row_1'),
    getQuestionContent('question22_row_2'),
    getQuestionContent('question22_row_3'),
    getQuestionContent('question22_row_4'),
    getQuestionContent('question22_row_5'),
    getQuestionContent('question22_row_6'),
  ];

  const q22_columns: Translation[] = [
    getQuestionContent('question22_col_1'),
    getQuestionContent('question22_col_2'),
    getQuestionContent('question22_col_3'),
  ];

  const q22_table_title: Translation = getQuestionContent('question22_title');

  const q22_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q22_rows.length,
    q22_columns.length,
  );

  const { en: q22_rows_en, fr: q22_rows_fr } = separateLanguages(q22_rows);
  const { en: q22_columns_en, fr: q22_columns_fr } = separateLanguages(q22_columns);

  // Create the NumericTable
  const q22: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '22',
    { en: 'Question 22', fr: 'Question 22 (French)' },
    q22_rows,
    q22_columns,
    q22_table_title,
    q22_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q22_${row}_${col}`, {
        en: `Question for ${q22_rows_en[row]} and ${q22_columns_en[col]}`,
        fr: `Question pour ${q22_rows_fr[row]} et ${q22_columns_fr[col]}`,
      }),
  );

  // Question 23 Table

  const q23_rows: Translation[] = [
    getQuestionContent('question23_row_1'),
    getQuestionContent('question23_row_2'),
  ];

  const q23_columns: Translation[] = [
    getQuestionContent('question23_col_1'),
    getQuestionContent('question23_col_2'),
    getQuestionContent('question23_col_3'),
  ];

  const q23_table_title: Translation = getQuestionContent('question23_title');

  const q23_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q23_rows.length,
    q23_columns.length,
  );

  const { en: q23_rows_en, fr: q23_rows_fr } = separateLanguages(q23_rows);
  const { en: q23_columns_en, fr: q23_columns_fr } = separateLanguages(q23_columns);

  // Create the NumericTable
  const q23: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '23',
    { en: 'Question 23', fr: 'Question 23 (French)' },
    q23_rows,
    q23_columns,
    q23_table_title,
    q23_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q23_${row}_${col}`, {
        en: `Question for ${q23_rows_en[row]} and ${q23_columns_en[col]}`,
        fr: `Question pour ${q23_rows_fr[row]} et ${q23_columns_fr[col]}`,
      }),
  );

  // question 24"

  const q24_rows: Translation[] = [
    getQuestionContent('question24_row_1'),
    getQuestionContent('question24_row_2'),
    getQuestionContent('question24_row_3'),
    getQuestionContent('question24_row_4'),
    getQuestionContent('question24_row_5'),
    getQuestionContent('question24_row_6'),
    getQuestionContent('question24_row_7'),
  ];

  const q24_columns: Translation[] = [getQuestionContent('question15_col_1')];

  const q24_table_title: Translation = getQuestionContent('question24_title');

  const q24_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q24_rows.length,
    q24_columns.length,
  );

  const { en: q24_rows_en, fr: q24_rows_fr } = separateLanguages(q24_rows);
  const { en: q24_columns_en, fr: q24_columns_fr } = separateLanguages(q24_columns);

  // Create the NumericTable
  const q24: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '24',
    { en: 'Question 24', fr: 'Question 24 (French)' },
    q24_rows,
    q24_columns,
    q24_table_title,
    q24_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q24_${row}_${col}`, {
        en: `Question for ${q24_rows_en[row]} and ${q24_columns_en[col]}`,
        fr: `Question pour ${q24_rows_fr[row]} et ${q24_columns_fr[col]}`,
      }),
  );

  maternityReport.addAll(
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
    q11,
    q12,
    q13,
    q14,
    q15,
    q16,
    q17,
    q18,
    q19,
    q20,
    q21,
    q22,
    q23,
    q24,
  );
  maternityReport.addBreakpoints(0, 5, 10, 14, 16, 18, 20, 22);

  return maternityReport;
};

export const buildCommunityHealthReport = (): QuestionGroup<ID, ErrorType> => {
  const communityhealthReport: QuestionGroup<ID, ErrorType> = new QuestionGroup<ID, ErrorType>(
    'ROOT',
    { en: 'Community Health Report', fr: 'Rapport sur la santé communautaire' },
  );

  const q1_table_title: Translation = { en: 'Age of Mothers', fr: 'Âge des Mères' };

  const q1_rows: Translation[] = [
    { en: '< 15 years', fr: '< 15 ans' },
    { en: '15-19 years', fr: '15-19 ans' },
    { en: '20-24 years', fr: '20-24 ans' },
    { en: '25-29 years', fr: '25-29 ans' },
    { en: '30 years plus', fr: '30 ans et plus' },
    { en: 'Unknown', fr: 'Inconnu' },
  ];

  const q1_columns: Translation[] = [
    { en: 'Trained Midwives', fr: 'Matrones formées' },
    { en: 'Others', fr: 'Autres' },
  ];

  const q1_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q1_rows.length,
    q1_columns.length,
  );

  const { en: q1_rows_en, fr: q1_rows_fr } = separateLanguages(q1_rows);
  const { en: q1_columns_en, fr: q1_columns_fr } = separateLanguages(q1_columns);

  // Create the NumericTable
  const q1: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '1',
    { en: 'Question 1', fr: 'Question 1 (French)' },
    q1_rows,
    q1_columns,
    q1_table_title,
    q1_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q1_${row}_${col}`, {
        en: `Question for ${q1_rows_en[row]} and ${q1_columns_en[col]}`,
        fr: `Question pour ${q1_rows_fr[row]} et ${q1_columns_fr[col]}`,
      }),
  );

  const q2_rows: Translation[] = [
    { en: 'Weight <1.5kg', fr: 'Poids <1,5kg' },
    { en: '1.5kg ≤ Weight <2.5kg', fr: '1,5kg ≤ Poids <2,5kg' },
    { en: '2.5kg and over', fr: '2,5kg et plus' },
    { en: 'Not weighed', fr: 'Non pesé' },
    { en: 'Immediately breastfed', fr: 'Allaité immédiatement' },
    { en: 'Skin to skin therapy', fr: 'Thérapie peau à peau' },
  ];

  const q2_columns: Translation[] = [
    { en: 'Matrones', fr: 'Matrones' },
    { en: 'Others', fr: 'Autres' },
  ];

  const q2_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q2_rows.length,
    q2_columns.length,
  );

  const { en: q2_rows_en, fr: q2_rows_fr } = separateLanguages(q2_rows);
  const { en: q2_columns_en, fr: q2_columns_fr } = separateLanguages(q2_columns);

  const q2_table_title: Translation = { en: 'Births', fr: 'Naissances' };

  const q2: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '2',
    { en: 'Question 2', fr: 'Question 2 (French)' },
    q2_rows,
    q2_columns,
    q2_table_title,
    q2_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q2_${row}_${col}`, {
        en: `Question for ${q2_rows_en[row]} and ${q2_columns_en[col]}`,
        fr: `Question pour ${q2_rows_fr[row]} et ${q2_columns_fr[col]}`,
      }),
  );

  const q3_rows: Translation[] = [
    {
      en: 'Breastfeeding women receiving vitamin A',
      fr: 'Femmes allaitantes recevant de la vitamine A',
    },
    { en: 'Breastfeeding women with MUAC <210mm', fr: 'Femmes allaitantes avec PB <210mm' },
    {
      en: 'Breastfeeding women with malnutrition support',
      fr: 'Femmes allaitantes avec MAM/MAS prises en charge',
    },
    { en: 'Domestic visits in 0-3 days', fr: 'Visites domicllaries 0-3 jours' },
  ];

  const q3_columns: Translation[] = [
    { en: 'Matrones', fr: 'Matrones' },
    { en: 'Others', fr: 'Autres' },
  ];

  const q3_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q3_rows.length,
    q3_columns.length,
  );

  const { en: q3_rows_en, fr: q3_rows_fr } = separateLanguages(q3_rows);
  const { en: q3_columns_en, fr: q3_columns_fr } = separateLanguages(q3_columns);

  const q3_table_title: Translation = {
    en: 'Suivi Post Natal',
    fr: 'Post Natal',
  };

  const q3: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '3',
    { en: 'Question 3', fr: 'Question 3 (French)' },
    q3_rows,
    q3_columns,
    q3_table_title,
    q3_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`Q3_${row}_${col}`, {
        en: `Question for ${q3_rows_en[row]} and ${q3_columns_en[col]}`,
        fr: `Question pour ${q3_rows_fr[row]} et ${q3_columns_fr[col]}`,
      }),
  );

  const q4_rows: Translation[] = [
    { en: 'Methods/ Sex', fr: 'Méthodes/ Sexe' },
    { en: 'Female OCP', fr: 'Contraceptifs Oraux pour Femmes' },
    { en: 'Female PP', fr: 'PP pour Femmes' },
    { en: 'Depo injection', fr: 'Injection Depo' },
    { en: 'Implant', fr: 'Implant' },
    { en: 'Inter uterine devices (IUD)', fr: 'Dispositifs Intra-Utérins (DIU)' },
    { en: 'Vaginal ring', fr: 'Anneau Vaginal' },
    { en: 'Breastfeeding as birth control', fr: 'Allaitement comme moyen de contraception' },
    { en: 'Female condom', fr: 'Préservatif féminin' },
    { en: 'Ligature', fr: 'Ligature' },
    { en: 'Male condom', fr: 'Préservatif masculin' },
    { en: 'Vasectomy', fr: 'Vasectomie' },
  ];

  const q4_columns: Translation[] = [
    { en: 'Acceptors <25 years', fr: 'Acceptants <25 ans' },
    { en: 'Acceptors 25 years and older', fr: 'Acceptants 25 ans et plus' },
    { en: 'Total Users <25 years', fr: 'Total Utilisateurs <25 ans' },
    { en: 'Total Users 25 years and older', fr: 'Total Utilisateurs 25 ans et plus' },
  ];

  const q4_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q4_rows.length,
    q4_columns.length,
  );

  const { en: q4_rows_en, fr: q4_rows_fr } = separateLanguages(q4_rows);
  const { en: q4_columns_en, fr: q4_columns_fr } = separateLanguages(q4_columns);

  const q4_table_title: Translation = { en: 'Birth Control', fr: 'Clients PF' };

  const q4: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '4',
    { en: 'Question 4', fr: 'Question 4 (French)' },
    q4_rows,
    q4_columns,
    q4_table_title,
    q4_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q4_${row}_${col}`, {
        en: `Question for ${q4_rows_en[row]} and ${q4_columns_en[col]}`,
        fr: `Question pour ${q4_rows_fr[row]} et ${q4_columns_fr[col]}`,
      }),
  );

  const q4_1_rows: Translation[] = [
    { en: 'Female OCP Cycle', fr: 'Contraceptifs Oraux pour Femmes Cycle' },
    { en: 'Female PP Cycle', fr: 'PP pour Femmes Cycle' },
    { en: 'Depo injection Vial', fr: 'Injection Depo Vial' },
    { en: 'Implant Paquet', fr: 'Implant Paquet' },
    { en: 'Inter uterine devices (IUD) Piece', fr: 'Dispositifs Intra-Utérins (DIU) Pièce' },
    { en: 'Vaginal ring Pièce', fr: 'Anneau Vaginal Pièce' },
    { en: 'Female condom Pièce', fr: 'Préservatif féminin Pièce' },
  ];

  const q4_1_columns: Translation[] = [
    { en: 'Quantity', fr: 'Quantité' },
    { en: 'Number of days out of stock/month', fr: 'Nbre de jours rupture de stocks/ mois' },
  ];

  const q4_1_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q4_1_rows.length,
    q4_1_columns.length,
  );

  const { en: q4_1_rows_en, fr: q4_1_rows_fr } = separateLanguages(q4_1_rows);
  const { en: q4_1_columns_en, fr: q4_1_columns_fr } = separateLanguages(q4_1_columns);

  const q4_1_table_title: Translation = {
    en: 'Contraceptives distributed',
    fr: 'Contraceptifs distribués',
  };

  const q4_1: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '4_1',
    { en: 'Question 4', fr: 'Question 4 (French)' },
    q4_1_rows,
    q4_1_columns,
    q4_1_table_title,
    q4_1_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q4_1_${row}_${col}`, {
        en: `Question for ${q4_1_rows_en[row]} and ${q4_1_columns_en[col]}`,
        fr: `Question pour ${q4_1_rows_fr[row]} et ${q4_1_columns_fr[col]}`,
      }),
  );

  const q5_rows: Translation[] = [
    { en: 'BCG', fr: 'BCG' },
    { en: 'VPO', fr: 'VPO' },
    { en: 'Penta', fr: 'Penta' },
    { en: 'Rota', fr: 'Rota' },
    { en: 'RR', fr: 'RR' },
    { en: 'dT', fr: 'dT' },
    { en: 'VPI', fr: 'VPI' },
    { en: 'Pneumo', fr: 'Pneumo' },
    { en: 'DTP', fr: 'DTP' },
    { en: 'COVID-19', fr: 'COVID-19' },
  ];

  const q5_columns: Translation[] = [
    { en: 'Quantity available during the month', fr: 'Quantité disponible au cours du mois' },
    { en: 'Balance at the end of the month', fr: 'Solde en fin de mois' },
    { en: 'Number of days of stock outs', fr: 'Nombre de jours de rupture de stocks' },
  ];

  const q5_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q5_rows.length,
    q5_columns.length,
  );

  const { en: q5_rows_en, fr: q5_rows_fr } = separateLanguages(q5_rows);
  const { en: q5_columns_en, fr: q5_columns_fr } = separateLanguages(q5_columns);

  const q5_table_title: Translation = { en: 'Type of Vaccine', fr: 'Type de vaccin' };

  const q5: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '5',
    { en: 'Question 5', fr: 'Question 5 (French)' },
    q5_rows,
    q5_columns,
    q5_table_title,
    q5_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q5_${row}_${col}`, {
        en: `Question for ${q5_rows_en[row]} and ${q5_columns_en[col]}`,
        fr: `Question pour ${q5_rows_fr[row]} et ${q5_columns_fr[col]}`,
      }),
  );

  const q6_rows: Translation[] = [
    { en: 'SAB 0.05ml', fr: 'SAB 0.05ml' },
    { en: 'SAB 0.5ml', fr: 'SAB 0.5ml' },
    { en: 'Sdil_2ml', fr: 'Sdil_2ml' },
    { en: 'Sdil_5ml', fr: 'Sdil_5ml' },
    { en: 'Boîtes Séc', fr: 'Boîtes Séc' },
    { en: 'Cotton', fr: 'Coton' },
  ];

  const q6_columns: Translation[] = [
    { en: 'Quantity available during the month', fr: 'Quantité disponible au cours du mois' },
    { en: 'Balance at the end of the month', fr: 'Solde en fin de mois' },
  ];

  const q6_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q6_rows.length,
    q6_columns.length,
  );

  const { en: q6_rows_en, fr: q6_rows_fr } = separateLanguages(q6_rows);
  const { en: q6_columns_en, fr: q6_columns_fr } = separateLanguages(q6_columns);

  const q6_table_title: Translation = { en: 'Consumables', fr: 'Intrants' };

  const q6: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '6',
    { en: 'Question 6', fr: 'Question 6 (French)' },
    q6_rows,
    q6_columns,
    q6_table_title,
    q6_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q6_${row}_${col}`, {
        en: `Question for ${q6_rows_en[row]} and ${q6_columns_en[col]}`,
        fr: `Question pour ${q6_rows_fr[row]} et ${q6_columns_fr[col]}`,
      }),
  );

  const q7_rows: Translation[] = [
    { en: 'BCG', fr: 'BCG' },
    { en: 'OPV (Polio)', fr: 'VPO (Polio)' },
    { en: 'OPV 1 (Polio)', fr: 'VPO 1 (Polio)' },
    { en: 'OPV 2 (Polio)', fr: 'VPO 2 (Polio)' },
    { en: 'OPV Booster', fr: 'Rappel VPO (Polio)' },
    {
      en: 'OPV + OPV 1 + OPV 2 + OPV Booster (Polio)',
      fr: 'VPO + VPO 1 + VPO 2 + VPO Booster (Polio)',
    },
    { en: 'IPV', fr: 'VPI' },
    { en: 'Penta 1', fr: 'Penta 1' },
    { en: 'Penta 2', fr: 'Penta 2' },
    { en: 'Penta 3', fr: 'Penta 3' },
    { en: 'Penta 1 + Penta 2 + Penta 3', fr: 'Penta 1 + Penta 2 + Penta 3' },
    { en: 'Rota 1', fr: 'Rota 1' },
    { en: 'Rota 2', fr: 'Rota 2' },
    { en: 'Rota 1 + Rota 2', fr: 'Rota 1 + Rota 2' },
    { en: 'RR 1', fr: 'RR 1' },
    { en: 'RR 2', fr: 'RR 2' },
    { en: 'RR 1 + RR 2', fr: 'RR 1 + RR 2' },
    { en: 'Pneumo 1', fr: 'Pneumo 1' },
    { en: 'Pneumo 2', fr: 'Pneumo 2' },
    { en: 'Pneumo 3', fr: 'Pneumo 3' },
    { en: 'Pneumo 1 + Pneumo 2 + Pneumo 3', fr: 'Pneumo 1 + Pneumo 2 + Pneumo 3' },
    { en: 'DTP Booster', fr: 'DTP Rappel' },
    { en: 'ECV', fr: 'ECV' },
  ];

  const q7_columns: Translation[] = [
    { en: '0-11 Months Inst.', fr: '0-11 Mois Inst.' },
    { en: '0-11 Months Comm.', fr: '0-11 Mois Comm.' },
    { en: '12-32 Months Inst.', fr: '12-32 Mois Inst.' },
    { en: '12-32 Months Comm.', fr: '12-32 Mois Comm.' },
    { en: 'Used', fr: 'Utilisées' },
    { en: 'Administered', fr: 'Administrées' },
  ];

  // Manual definition of grey table cell
  // Guide on how to manually define grey and calcualtion table cells:
  // https://docs.google.com/document/d/1mYgMfttisqM9zXPbe77ezRdivqxFtik6/edit
  const q7_grey_index: maskIndex[] = [
    [5, 0],
    [5, 1],
    [13, 0],
    [13, 1],
    [15, 0],
    [15, 1],
    [16, 0],
    [16, 1],
    [16, 2],
    [16, 3],
    [20, 0],
    [20, 1],
    [21, 0],
    [21, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    [10, 0],
    [10, 1],
    [10, 2],
    [11, 2],
    [12, 2],
    [13, 2],
    [14, 2],
    [17, 2],
    [18, 2],
    [19, 2],
    [20, 2],
    [22, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 3],
    [10, 3],
    [11, 3],
    [12, 3],
    [13, 3],
    [14, 3],
    [17, 3],
    [18, 3],
    [19, 3],
    [20, 3],
    [22, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 4],
    [4, 5],
    [7, 4],
    [7, 5],
    [8, 4],
    [8, 5],
    [9, 4],
    [9, 5],
    [11, 4],
    [11, 5],
    [12, 4],
    [12, 5],
    [14, 4],
    [14, 5],
    [15, 4],
    [15, 5],
    [17, 4],
    [17, 5],
    [18, 4],
    [18, 5],
    [19, 4],
    [19, 5],
  ];
  const q7_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q7_rows.length,
    q7_columns.length,
    q7_grey_index,
  );

  // Manual definition of calculation table cell
  // Guide on how to manually define grey and calcualtion table cells:
  // https://docs.google.com/document/d/1mYgMfttisqM9zXPbe77ezRdivqxFtik6/edit
  const q7_calculationMask: Array<Array<cellIndices>> = [
    [
      // For each cell in the row
      [], // No calculation for this cell (row 0 column 0)
      [], // No calculation for this cell (row 0 column 1)
      [], // ... etc
      [],
      [],

      // Calculation Cell (row 0 column 2)
      // BCG Administered
      [
        [0, 0],
        [0, 1],
      ],
    ],
    // OPVs
    [],
    [],
    [],
    [],

    // OPV total
    [
      [],
      [],
      [],
      [],

      [],
      // Calculation Cell (row 1 column 2)
      [
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        [3, 0],
        [3, 1],
        [4, 0],
        [4, 1],
      ],
    ],

    // IPV
    [
      [],
      [],
      [],
      [],
      [],
      [
        [6, 0],
        [6, 1],
      ],
    ],

    // Pentas
    [],
    [],
    [],

    // Penta total
    [
      [],
      [],
      [],
      [],

      [],
      [
        [7, 0],
        [7, 1],
        [8, 0],
        [8, 1],
        [9, 0],
        [9, 1],
      ],
    ],
    // Rotas
    [],
    [],

    // Rota total
    [
      [],
      [],
      [],
      [],
      [],
      [
        [11, 0],
        [11, 1],
        [12, 0],
        [12, 1],
      ],
    ],

    // RRs
    [],
    [],

    // RR total
    [
      [],
      [],
      [],
      [],
      [],

      [
        [14, 0],
        [14, 1],
        [15, 2],
        [15, 3],
      ],
    ],

    // Pneumos
    [],
    [],
    [],

    // Pneumos total
    [
      [],
      [],
      [],
      [],
      [],
      [
        [17, 0],
        [17, 1],
        [18, 0],
        [18, 1],
        [19, 0],
        [19, 1],
      ],
    ],

    // DTP booster
    [
      [],
      [],
      [],
      [],
      [],
      [
        [21, 2],
        [21, 3],
      ],
    ],

    // ECV
    [
      [],
      [],
      [],
      [],
      [],
      [
        [22, 0],
        [22, 1],
      ],
    ],
  ];

  const { en: q7_rows_en, fr: q7_rows_fr } = separateLanguages(q7_rows);
  const { en: q7_columns_en, fr: q7_columns_fr } = separateLanguages(q7_columns);

  const q7_table_title: Translation = {
    en: 'Girl Vaccination',
    fr: 'Filles Vaccination',
  };

  const q7: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '7',
    { en: 'Question 7', fr: 'Question 7 (French)' },
    q7_rows,
    q7_columns,
    q7_table_title,
    q7_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q7_${row}_${col}`, {
        en: `Question for ${q7_rows_en[row]} and ${q7_columns_en[col]}`,
        fr: `Question pour ${q7_rows_fr[row]} et ${q7_columns_fr[col]}`,
      }),
    q7_calculationMask,
  );

  const q7_1_rows: Translation[] = [
    { en: 'BCG', fr: 'BCG' },
    { en: 'OPV (Polio)', fr: 'VPO (Polio)' },
    { en: 'OPV 1 (Polio)', fr: 'VPO 1 (Polio)' },
    { en: 'OPV 2 (Polio)', fr: 'VPO 2 (Polio)' },
    { en: 'OPV Booster', fr: 'Rappel VPO (Polio)' },
    {
      en: 'OPV + OPV 1 + OPV 2 + OPV Booster (Polio)',
      fr: 'VPO + VPO 1 + VPO 2 + VPO Booster (Polio)',
    },
    { en: 'IPV', fr: 'VPI' },
    { en: 'Penta 1', fr: 'Penta 1' },
    { en: 'Penta 2', fr: 'Penta 2' },
    { en: 'Penta 3', fr: 'Penta 3' },
    { en: 'Penta 1 + Penta 2 + Penta 3', fr: 'Penta 1 + Penta 2 + Penta 3' },
    { en: 'Rota 1', fr: 'Rota 1' },
    { en: 'Rota 2', fr: 'Rota 2' },
    { en: 'Rota 1 + Rota 2', fr: 'Rota 1 + Rota 2' },
    { en: 'RR 1', fr: 'RR 1' },
    { en: 'RR 2', fr: 'RR 2' },
    { en: 'RR 1 + RR 2', fr: 'RR 1 + RR 2' },
    { en: 'Pneumo 1', fr: 'Pneumo 1' },
    { en: 'Pneumo 2', fr: 'Pneumo 2' },
    { en: 'Pneumo 3', fr: 'Pneumo 3' },
    { en: 'Pneumo 1 + Pneumo 2 + Pneumo 3', fr: 'Pneumo 1 + Pneumo 2 + Pneumo 3' },
    { en: 'DTP Booster', fr: 'DTP Rappel' },
    { en: 'ECV', fr: 'ECV' },
  ];

  const q7_1_columns: Translation[] = [
    { en: '0-11 Months Inst.', fr: '0-11 Mois Inst.' },
    { en: '0-11 Months Comm.', fr: '0-11 Mois Comm.' },
    { en: '12-32 Months Inst.', fr: '12-32 Mois Inst.' },
    { en: '12-32 Months Comm.', fr: '12-32 Mois Comm.' },
    { en: 'Used', fr: 'Utilisées' },
    { en: 'Administered', fr: 'Administrées' },
  ];
  const q7_1_grey_index: maskIndex[] = [
    [5, 0],
    [5, 1],
    [13, 0],
    [13, 1],
    [15, 0],
    [15, 1],
    [16, 0],
    [16, 1],
    [16, 2],
    [16, 3],
    [20, 0],
    [20, 1],
    [21, 0],
    [21, 1],
    [0, 2],
    [1, 2],
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [6, 2],
    [7, 2],
    [8, 2],
    [9, 2],
    [10, 0],
    [10, 1],
    [10, 2],
    [11, 2],
    [12, 2],
    [13, 2],
    [14, 2],
    [17, 2],
    [18, 2],
    [19, 2],
    [20, 2],
    [22, 2],
    [0, 3],
    [1, 3],
    [2, 3],
    [3, 3],
    [4, 3],
    [5, 3],
    [6, 3],
    [7, 3],
    [8, 3],
    [9, 3],
    [10, 3],
    [11, 3],
    [12, 3],
    [13, 3],
    [14, 3],
    [17, 3],
    [18, 3],
    [19, 3],
    [20, 3],
    [22, 3],
    [1, 4],
    [1, 5],
    [2, 4],
    [2, 5],
    [3, 4],
    [3, 5],
    [4, 4],
    [4, 5],
    [7, 4],
    [7, 5],
    [8, 4],
    [8, 5],
    [9, 4],
    [9, 5],
    [11, 4],
    [11, 5],
    [12, 4],
    [12, 5],
    [14, 4],
    [14, 5],
    [15, 4],
    [15, 5],
    [17, 4],
    [17, 5],
    [18, 4],
    [18, 5],
    [19, 4],
    [19, 5],
  ];

  const q7_1_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q7_1_rows.length,
    q7_1_columns.length,
    q7_1_grey_index,
  );

  const q7_1_calculationMask: Array<Array<cellIndices>> = [
    [
      // For each cell in the row
      [], // No calculation for this cell (row 0 column 0)
      [], // No calculation for this cell (row 0 column 1)
      [], // ... etc
      [],
      [],

      // Calculation Cell (row 0 column 2)
      // BCG Administered
      [
        [0, 0],
        [0, 1],
      ],
    ],
    // OPVs
    [],
    [],
    [],
    [],

    // OPV total
    [
      [],
      [],
      [],
      [],

      [],
      // Calculation Cell (row 1 column 2)
      [
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1],
        [3, 0],
        [3, 1],
        [4, 0],
        [4, 1],
      ],
    ],

    // IPV
    [
      [],
      [],
      [],
      [],
      [],
      [
        [6, 0],
        [6, 1],
      ],
    ],

    // Pentas
    [],
    [],
    [],

    // Penta total
    [
      [],
      [],
      [],
      [],

      [],
      [
        [7, 0],
        [7, 1],
        [8, 0],
        [8, 1],
        [9, 0],
        [9, 1],
      ],
    ],
    // Rotas
    [],
    [],

    // Rota total
    [
      [],
      [],
      [],
      [],

      [],
      [
        [11, 0],
        [11, 1],
        [12, 0],
        [12, 1],
      ],
    ],

    // RRs
    [],
    [],

    // RR total
    [
      [],
      [],
      [],
      [],
      [],

      [
        [14, 0],
        [14, 1],
        [15, 2],
        [15, 3],
      ],
    ],

    // Pneumos
    [],
    [],
    [],

    // Pneumos total
    [
      [],
      [],
      [],
      [],
      [],
      [
        [17, 0],
        [17, 1],
        [18, 0],
        [18, 1],
        [19, 0],
        [19, 1],
      ],
    ],

    // DTP booster
    [
      [],
      [],
      [],
      [],
      [],
      [
        [21, 2],
        [21, 3],
      ],
    ],

    // ECV
    [
      [],
      [],
      [],
      [],
      [],
      [
        [22, 0],
        [22, 1],
      ],
    ],
  ];

  const { en: q7_1_rows_en, fr: q7_1_rows_fr } = separateLanguages(q7_1_rows);
  const { en: q7_1_columns_en, fr: q7_1_columns_fr } = separateLanguages(q7_1_columns);

  const q7_1_table_title: Translation = {
    en: 'Boy Vaccination',
    fr: 'Garçon Vaccination',
  };

  const q7_1: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '7_1',
    { en: 'Question 7_1', fr: 'Question 7_1 (French)' },
    q7_1_rows,
    q7_1_columns,
    q7_1_table_title,
    q7_1_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q7_1_${row}_${col}`, {
        en: `Question for ${q7_1_rows_en[row]} and ${q7_1_columns_en[col]}`,
        fr: `Question pour ${q7_1_rows_fr[row]} et ${q7_1_columns_fr[col]}`,
      }),
    q7_1_calculationMask,
  );

  const q7_2_rows: Translation[] = [
    { en: 'BCG', fr: 'BCG' },
    {
      en: 'OPV + OPV 1 + OPV 2 + OPV Booster (Polio)',
      fr: 'VPO + VPO 1 + VPO 2 + VPO Booster (Polio)',
    },
    { en: 'IPV', fr: 'VPI' },
    { en: 'Penta 1 + Penta 2 + Penta 3', fr: 'Penta 1 + Penta 2 + Penta 3' },
    { en: 'Rota 1 + Rota 2', fr: 'Rota 1 + Rota 2' },
    { en: 'RR 1 + RR 2', fr: 'RR 1 + RR 2' },
    { en: 'Pneumo 1 + Pneumo 2 + Pneumo 3', fr: 'Pneumo 1 + Pneumo 2 + Pneumo 3' },
    { en: 'DTP Booster', fr: 'DTP Rappel' },
    { en: 'ECV', fr: 'ECV' },
  ];

  const q7_2_columns: Translation[] = [
    { en: 'Used', fr: 'Utilisées' },
    { en: 'Administered', fr: 'Administrées' },
  ];
  const q7_2_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q7_2_rows.length,
    q7_2_columns.length,
  );

  const { en: q7_2_rows_en, fr: q7_2_rows_fr } = separateLanguages(q7_2_rows);
  const { en: q7_2_columns_en, fr: q7_2_columns_fr } = separateLanguages(q7_2_columns);

  const q7_2_table_title: Translation = {
    en: 'Vaccine Doses',
    fr: 'Doses de vaccin',
  };

  const q7_2: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '7_2',
    { en: 'Question 7_2', fr: 'Question 7_2 (French)' },
    q7_2_rows,
    q7_2_columns,
    q7_2_table_title,
    q7_2_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q7_2_${row}_${col}`, {
        en: `Question for ${q7_2_rows_en[row]} and ${q7_2_columns_en[col]}`,
        fr: `Question pour ${q7_2_rows_fr[row]} et ${q7_2_columns_fr[col]}`,
      }),
  );

  const q7_3_rows: Translation[] = [
    { en: 'dT1', fr: 'dT1' },
    { en: 'dT2+', fr: 'dT2+' },
    { en: 'dT1+dT2+', fr: 'dT1+dT2+' },
  ];

  const q7_3_columns: Translation[] = [
    { en: 'Inst.', fr: 'Inst.' },
    { en: 'Comm.', fr: 'Comm.' },
    { en: 'Total', fr: 'Total' },
  ];

  // Example of setting up calculationMask for a specific table
  // Note that in the future, when we have the feature to let user define questions on the APP's frontend
  // This calculation masks can be set with a proper interface
  // For now devs need to hard code to define calculation cells
  const q7_3_calculationMask: Array<Array<cellIndices>> = [
    // For each row
    // Row 0
    [
      // For each cell in the row
      [], // No calculation for this cell (row 0 column 0)
      [], // No calculation for this cell (row 0 column 1)

      // Calculation Cell (row 0 column 2)
      [
        // Sum of the values from cells [0,0] and [0,1]
        [0, 0],
        [0, 1],
      ],
      // ...other columns on row 0
    ],
    // Row 1
    [
      // For each cell in the row
      [], // No calculation for these cell
      [],

      // Calculation Cell (row 1 column 2)
      [
        [1, 0],
        [1, 1],
      ], // Sum of the values from cells [1,0] and [1,1]
      // ...other columns on row 1
    ],
    // Row 2
    [
      // For each cell in the row
      [], // No calculation for these cell
      [],

      // Calculation Cell (row 2 column 2)
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
      ],
    ],
  ];

  const q7_3_grey_index: maskIndex[] = [
    [2, 0],
    [2, 1],
  ];

  const q7_3_grey_mask: Array<Array<boolean>> = createTableGreyMask(
    q7_3_rows.length,
    q7_3_columns.length,
    q7_3_grey_index,
  );

  const { en: q7_3_rows_en, fr: q7_3_rows_fr } = separateLanguages(q7_3_rows);
  const { en: q7_3_columns_en, fr: q7_3_columns_fr } = separateLanguages(q7_3_columns);

  const q7_3_table_title: Translation = {
    en: 'Pregnant Women',
    fr: 'Femmes enceintes',
  };

  const q7_3: NumericTable<ID, ErrorType> = new NumericTable<ID, ErrorType>(
    '7_3',
    { en: 'Question 7_3', fr: 'Question 7_3 (French)' },
    q7_3_rows,
    q7_3_columns,
    q7_3_table_title,
    q7_3_grey_mask,
    (row: number, col: number) =>
      new NumericQuestion<ID, ErrorType>(`q7_3_${row}_${col}`, {
        en: `Question for ${q7_3_rows_en[row]} and ${q7_3_columns_en[col]}`,
        fr: `Question pour ${q7_3_rows_fr[row]} et ${q7_3_columns_fr[col]}`,
      }),
    q7_3_calculationMask,
  );

  // Add Age of Mothers table to the report
  communityhealthReport.addAll(q1, q2, q3, q4, q4_1, q5, q6, q7, q7_1, q7_2, q7_3);
  communityhealthReport.addBreakpoints(0, 1, 2, 3, 5, 7);

  return communityhealthReport;
};
