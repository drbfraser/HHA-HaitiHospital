import { CompositionQuestion, QuestionGroup, NumericQuestion, QuestionNode, ExpandableQuestion, SingleSelectionQuestion, MultipleSelectionQuestion, TextQuestion } from '../../src';

const questionIdGeneratorBuilder =
  (questionId: string) =>
  (questionGroupIndex: number): string =>
    `${questionId}_${questionGroupIndex}`;

const buildRehabMockReport = () => {
  const reportID: string = 'rehab-report_1';
  const rehabReport: QuestionGroup<string, string> = new QuestionGroup<string, string>(reportID);

  // Questions 1 to 4
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available', 19);
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days', 434);
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days', 377);
  const q4: NumericQuestion<string, string> = new NumericQuestion<string, string>('4', 'Hospitalized', 17);

  // Question 5
  const q5: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('5', questionIdGeneratorBuilder('5'));

  const q5_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_1', 'Discharged diagnosis', 0);
  const q5_1_choices: string[] = ['SCI', 'Stroke', 'Other'];
  for (const choice in q5_1_choices) {
    q5_1.addChoice(choice);
  }

  const q5_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('5_2', 'No. Days in Rehab Unit from admission to discharge', 230);

  const q5_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_3', 'Discharged reason', 0);
  const q5_3_choices: string[] = ['All goals met', 'Goals partially met, sufficient for discharge', 'Goals not met, discharged for alternate reason'];
  for (const choice in q5_3_choices) {
    q5_3.addChoice(choice);
  }

  const q5_4: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_4', 'Discharge Outcome (ADLs/Self-Care)', 0);
  const q5_4_choices: string[] = ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'];
  for (const choice in q5_4_choices) {
    q5_4.addChoice(choice);
  }

  const q5_5: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_5', 'Discharge Outcome (Transfers and Mobility)', 0);
  const q5_5_choices: string[] = ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'];
  for (const choice in q5_5_choices) {
    q5_5.addChoice(choice);
  }

  const q5_6: MultipleSelectionQuestion<string, string> = new MultipleSelectionQuestion<string, string>('5_6', 'Mobility Aid/Assistive Device Given?', [0, 2]);
  const q5_6_choices: string[] = ['Wheelchair', 'Walker', 'Cane', 'Crutches'];
  for (const choice in q5_6_choices) {
    q5_6.addChoice(choice);
  }

  const q5_7: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_7', 'Discharge Location', 0);
  const q5_7_choices: string[] = ['Return home, alone', 'Return home, with family/caregiver(s)', 'Admitted to hospital'];
  for (const choice in q5_7_choices) {
    q5_7.addChoice(choice);
  }

  const q5_8: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_8', 'Discharge Employment Status', 0);
  const q5_8_choices: string[] = ['Employed', 'Unemployed, unable to find work', 'Unemployed, due to condition', 'Retired, not working due to age'];
  for (const choice in q5_8_choices) {
    q5_8.addChoice(choice);
  }

  q5.addAllToTemplate(q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8);

  // Question 6
  const q6: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('6', questionIdGeneratorBuilder('6'));
  const q6_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('6_1', 'Diagnosis');
  const q6_1_choices: string[] = ['SCI', 'CVA', 'Other'];
  for (const choice in q6_1_choices) {
    q6_1.addChoice(choice);
  }

  const q6_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('6_2', 'Age');

  const q6_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('6_3', 'Cause of death');
  const q6_3_choices: string[] = ['Suspected CVA'];
  for (const choice in q6_3_choices) {
    q6_3.addChoice(choice);
  }

  q6.addAllToTemplate(q6_1, q6_2, q6_3);

  // Question 7
  const q7: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('7', questionIdGeneratorBuilder('7'));
  const q7_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('7_1', 'Diagnosis');
  const q7_1_choices: string[] = ['SCI', 'CVA', 'Other'];
  for (const choice in q7_1_choices) {
    q7_1.addChoice(choice);
  }

  const q7_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('7_2', 'Age');
  const q7_3: TextQuestion<string, string> = new TextQuestion<string, string>('7_3', 'Cause of death');

  q7.addAllToTemplate(q7_1, q7_2, q7_3);

  // Questions 8 to 10
  const q8: NumericQuestion<string, string> = new NumericQuestion<string, string>('8', 'Days hospitalised');
  const q9: NumericQuestion<string, string> = new NumericQuestion<string, string>('9', 'Referrals');
  const q10: NumericQuestion<string, string> = new NumericQuestion<string, string>('10', 'Transfers');

  // Question 11
  const q11: NumericQuestion<string, string> = new NumericQuestion<string, string>('11', 'Self-discharged');
  const q11_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('11_1', 'Reason for self-discharge');
  const q11_1_choices: string[] = ['Finance: Left as cannot afford care', 'Finance: Left to avoid paying', 'Religious/Cultural', 'Personal/Family', 'Other'];
  for (const choice in q11_1_choices) {
    q11_1.addChoice(choice);
  }

  // Question 12
  const q12: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('12');
  const q12_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('12_1');
  const q12_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_1', 'Not ready from therapy standpoint');
  const q12_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_2', 'Wound Care');
  const q12_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_3', 'Other medical reason (such as IV medication)');
  const q12_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_4', 'Financial/no place to discharge to');

  q12_1.addAll(q12_1_1, q12_1_2, q12_1_3);

  const q12_2: QuestionGroup<string, string> = new QuestionGroup<string, string>('12_2');
  const q12_2_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_1', '1-3 months');
  const q12_2_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_2', '3-6 months');
  const q12_2_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_3', '6 months - 1 year');
  const q12_2_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_4', '1-2 years');
  const q12_2_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_5', '2-3 years ');
  const q12_2_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_6', '3+ years ');

  q12_2.addAll(q12_2_1, q12_2_2, q12_2_3, q12_2_4, q12_2_5, q12_2_6);
  // TODO: Add q12_1 and q12_2 to q12

  // Question 13
  const q13: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('13');
  const q13_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('13_1');
  const q13_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_1', 'Quarter Morin');
  const q13_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_2', 'Cap Haitian');
  const q13_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_3', 'Department Nord');
  const q13_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_4', 'Other departments');

  q13_1.addAll(q13_1_1, q13_1_2, q13_1_3, q13_1_4);
  // TODO: Add q13_1 to q13

  rehabReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13);
};

describe('Report', function () {
  describe('Mock report', function () {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });
  });
});
