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
  const q5IdGenerator = (questionGroupIndex: number): string => `5_${questionGroupIndex}`;
  const q5: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('5', q5IdGenerator);

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
};

describe('Report', function () {
  describe('Mock report', function () {
    it('Should create a mock rehab report', function () {
      buildRehabMockReport();
    });
  });
});
