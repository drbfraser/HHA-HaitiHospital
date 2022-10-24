import { CompositionQuestion, QuestionGroup, NumericQuestion, QuestionNode, ExpandableQuestion, SingleSelectionQuestion, MultipleSelectionQuestion, TextQuestion } from '../../src';

const questionIdGeneratorBuilder =
  (questionId: string) =>
  (questionGroupIndex: number): string =>
    `${questionId}_${questionGroupIndex}`;

const buildRehabMockReport = () => {
  const reportID: string = 'rehab-report_1';
  const rehabReport: QuestionGroup<string, string> = new QuestionGroup<string, string>(reportID, "Rehab Report");

  // Questions 1 to 4
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available', 19);
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days', 434);
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days', 377);
  const q4: NumericQuestion<string, string> = new NumericQuestion<string, string>('4', 'Hospitalized', 17);

  // Question 5
  const q5: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('5', 'Discharged Alive', questionIdGeneratorBuilder('5'));

  const q5_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_1', 'Discharged diagnosis', 
    ['SCI', 'Stroke', 'Other'],
    0);

  const q5_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('5_2', 'No. Days in Rehab Unit from admission to discharge', 230);

  const q5_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_3', 'Discharged reason', 
    ['All goals met', 'Goals partially met, sufficient for discharge', 'Goals not met, discharged for alternate reason'],
    0);

  const q5_4: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_4', 'Discharge Outcome (ADLs/Self-Care)', 
    ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'],
    0);
  

  const q5_5: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_5', 'Discharge Outcome (Transfers and Mobility)', 
  ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'],
  0);

  const q5_6: MultipleSelectionQuestion<string, string> = new MultipleSelectionQuestion<string, string>('5_6', 'Mobility Aid/Assistive Device Given?',
    ['Wheelchair', 'Walker', 'Cane', 'Crutches'],
    [0, 2]);

  const q5_7: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_7', 'Discharge Location', 
    ['Return home, alone', 'Return home, with family/caregiver(s)', 'Admitted to hospital'],
    0);

  const q5_8: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_8', 'Discharge Employment Status', 
    ['Employed', 'Unemployed, unable to find work', 'Unemployed, due to condition', 'Retired, not working due to age'],
    0);

  q5.addAllToTemplate(q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8);

  // Question 6
  const q6: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('6', 'Died before 48h', questionIdGeneratorBuilder('6'));
  const q6_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('6_1', 'Diagnosis', ['SCI', 'CVA', 'Other']);

  const q6_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('6_2', 'Age');

  const q6_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('6_3', 'Cause of death', ['Suspected CVA']);

  q6.addAllToTemplate(q6_1, q6_2, q6_3);

  // Question 7
  const q7: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('7', 'Died after 48h', questionIdGeneratorBuilder('7'));
  const q7_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('7_1', 'Diagnosis', ['SCI', 'CVA', 'Other']);

  const q7_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('7_2', 'Age');
  const q7_3: TextQuestion<string, string> = new TextQuestion<string, string>('7_3', 'Cause of death');

  q7.addAllToTemplate(q7_1, q7_2, q7_3);

  // Questions 8 to 10
  const q8: NumericQuestion<string, string> = new NumericQuestion<string, string>('8', 'Days hospitalised');
  const q9: NumericQuestion<string, string> = new NumericQuestion<string, string>('9', 'Referrals');
  const q10: NumericQuestion<string, string> = new NumericQuestion<string, string>('10', 'Transfers');

  // Question 11
  const q11: NumericQuestion<string, string> = new NumericQuestion<string, string>('11', 'Self-discharged');
  const q11_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('11_1', 'Reason for self-discharge', 
    ['Finance: Left as cannot afford care', 'Finance: Left to avoid paying', 'Religious/Cultural', 'Personal/Family', 'Other']);

  // Question 12
  const q12: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('12', 'Stayed in the ward');
  const q12_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('12_1', 'Reason Not Yet Discharged');
  const q12_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_1', 'Not ready from therapy standpoint');
  const q12_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_2', 'Wound Care');
  const q12_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_3', 'Other medical reason (such as IV medication)');
  const q12_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_4', 'Financial/no place to discharge to');

  q12_1.addAll(q12_1_1, q12_1_2, q12_1_3);

  const q12_2: QuestionGroup<string, string> = new QuestionGroup<string, string>('12_2', 'Length of Stay of Current Inpatients');
  const q12_2_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_1', '1-3 months');
  const q12_2_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_2', '3-6 months');
  const q12_2_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_3', '6 months - 1 year');
  const q12_2_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_4', '1-2 years');
  const q12_2_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_5', '2-3 years ');
  const q12_2_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_2_6', '3+ years ');

  q12_2.addAll(q12_2_1, q12_2_2, q12_2_3, q12_2_4, q12_2_5, q12_2_6);
  // TODO: Add q12_1 and q12_2 to q12

  // Question 13
  const q13: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('13', 'Admissions');
  const q13_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('13_1', 'Where do patients come from?');
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
