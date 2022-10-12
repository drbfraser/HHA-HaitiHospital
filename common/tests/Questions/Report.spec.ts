import { CompositionQuestion, QuestionGroup, NumericQuestion, QuestionNode, ExpandableQuestion, SingleSelectionQuestion, MultipleSelectionQuestion } from '../../src';

const buildRehabMockReport = () => {
  const reportID: string = 'rehab-report_1';
  const rehabReport: QuestionGroup<string, string> = new QuestionGroup<string, string>(reportID);

  // Questions 1 to 4
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available', 19);
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days', 434);
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days', 377);
  const q4: NumericQuestion<string, string> = new NumericQuestion<string, string>('4', 'Hospitalized', 17);

  // Question 5
  let q5_patient_count: number = 2;
  let q5: QuestionGroup<string, string>[] = [];

  for (let i: number = 0; i < q5_patient_count; i++) {
    const q5_patient: QuestionGroup<string, string> = new QuestionGroup<string, string>(`5_${i + 1}`);
    const q5_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_1_${i + 1}`, 'Discharged diagnosis', 0);
    const q5_1_choices: string[] = ['SCI', 'Stroke', 'Other'];
    for (const choice in q5_1_choices) {
      q5_1.addChoice(choice);
    }

    const q5_2: NumericQuestion<string, string> = new NumericQuestion<string, string>(`5_2_${i + 1}`, 'No. Days in Rehab Unit from admission to discharge', 230);

    const q5_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_3_${i + 1}`, 'Discharged reason', 0);
    const q5_3_choices: string[] = ['All goals met', 'Goals partially met, sufficient for discharge', 'Goals not met, discharged for alternate reason'];
    for (const choice in q5_3_choices) {
      q5_3.addChoice(choice);
    }

    const q5_4: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_4_${i + 1}`, 'Discharge Outcome (ADLs/Self-Care)', 0);
    const q5_4_choices: string[] = ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'];
    for (const choice in q5_4_choices) {
      q5_4.addChoice(choice);
    }

    const q5_5: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_5_${i + 1}`, 'Discharge Outcome (Transfers and Mobility)', 0);
    const q5_5_choices: string[] = ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'];
    for (const choice in q5_5_choices) {
      q5_5.addChoice(choice);
    }

    const q5_6: MultipleSelectionQuestion<string, string> = new MultipleSelectionQuestion<string, string>(`5_6_${i + 1}`, 'Mobility Aid/Assistive Device Given?', [0, 2]);
    const q5_6_choices: string[] = ['Wheelchair', 'Walker', 'Cane', 'Crutches'];
    for (const choice in q5_6_choices) {
      q5_6.addChoice(choice);
    }

    const q5_7: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_7_${i + 1}`, 'Discharge Location', 0);
    const q5_7_choices: string[] = ['Return home, alone', 'Return home, with family/caregiver(s)', 'Admitted to hospital'];
    for (const choice in q5_7_choices) {
      q5_7.addChoice(choice);
    }

    const q5_8: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(`5_8_${i + 1}`, 'Discharge Employment Status', 0);
    const q5_8_choices: string[] = ['Employed', 'Unemployed, unable to find work', 'Unemployed, due to condition', 'Retired, not working due to age'];
    for (const choice in q5_8_choices) {
      q5_8.addChoice(choice);
    }

    q5_patient.addAll(q5_1, q5_2, q5_3, q5_4, q5_5, q5_6, q5_7, q5_8);
    q5.push(q5_patient);
  }

  rehabReport.addAll(q1, q2, q3, q4, ...q5);
};

describe('Report', function () {
  describe('Mock report', function () {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });
  });
});
