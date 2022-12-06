import { CompositionQuestion, QuestionGroup, NumericQuestion, ExpandableQuestion, SingleSelectionQuestion, MultipleSelectionQuestion, TextQuestion, SpecializedGroup } from './Questions';

const questionIdGeneratorBuilder =
  (questionId: string) =>
  (questionGroupIndex: number): string =>
    `${questionId}_${questionGroupIndex}`;

export const oneQuestionMockReport = (): QuestionGroup<string, string> => {
  const report: QuestionGroup<string, string> = new QuestionGroup<string, string>("ROOT", "OneQuestionReport"); 
  const q1: TextQuestion<string, string> = new TextQuestion("1", "What is your name?");
  report.add(q1);

  return report;
}

// TODO: Finish report
export const buildRehabMockReport = (): QuestionGroup<string, string> => {
  const reportID: string = 'rehab-report_1';
  const rehabReport: QuestionGroup<string, string> = new QuestionGroup<string, string>(reportID, 'Rehab Report');

  // Questions 1 to 4
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available', 19);
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days', 434);
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days', 377);
  const q4: NumericQuestion<string, string> = new NumericQuestion<string, string>('4', 'Hospitalized', 17);

  // Question 5
  const q5: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('5', 'Discharged Alive', questionIdGeneratorBuilder('5'));

  const q5_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('5_1', 'Discharged diagnosis', ['SCI', 'Stroke', 'Other'], 0);

  const q5_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('5_2', 'No. Days in Rehab Unit from admission to discharge', 230);

  const q5_3: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(
    '5_3',
    'Discharged reason',
    ['All goals met', 'Goals partially met, sufficient for discharge', 'Goals not met, discharged for alternate reason'],
    0
  );

  const q5_4: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(
    '5_4',
    'Discharge Outcome (ADLs/Self-Care)',
    ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'],
    0
  );

  const q5_5: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(
    '5_5',
    'Discharge Outcome (Transfers and Mobility)',
    ['Independent', 'Modified Independent', 'Supervision', 'Minimum Assistance', 'Moderate Assistance', 'Maximum Assistance', 'Dependent'],
    0
  );

  const q5_6: MultipleSelectionQuestion<string, string> = new MultipleSelectionQuestion<string, string>(
    '5_6',
    'Mobility Aid/Assistive Device Given?',
    ['Wheelchair', 'Walker', 'Cane', 'Crutches'],
    [0, 2]
  );

  const q5_7: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(
    '5_7',
    'Discharge Location',
    ['Return home, alone', 'Return home, with family/caregiver(s)', 'Admitted to hospital'],
    0
  );

  const q5_8: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>(
    '5_8',
    'Discharge Employment Status',
    ['Employed', 'Unemployed, unable to find work', 'Unemployed, due to condition', 'Retired, not working due to age'],
    0
  );

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
  /* UNUSED
  const q11_1: SingleSelectionQuestion<string, string> = new SingleSelectionQuestion<string, string>('11_1', 'Reason for self-discharge', [
    'Finance: Left as cannot afford care',
    'Finance: Left to avoid paying',
    'Religious/Cultural',
    'Personal/Family',
    'Other'
  ]);*/

  // Question 12
  const q12: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('12', 'Stayed in the ward');
  const q12_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('12_1', 'Reason Not Yet Discharged');
  const q12_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_1', 'Not ready from therapy standpoint');
  const q12_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_2', 'Wound Care');
  const q12_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_3', 'Other medical reason (such as IV medication)');
  // const q12_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('12_1_4', 'Financial/no place to discharge to');

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
  return rehabReport;
};

export const buildNicuPaedsMockReport = (): QuestionGroup<string, string> => {
  const reportID: string = 'nicu-paeds-report_1';
  const nicuPaedsReport: QuestionGroup<string, string> = new QuestionGroup<string, string>('MSPP Data', reportID);

  // Questions 1 to 3
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available');
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days');
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days');

  // Question 4 "Hospitalized"
  const q4_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('4_1_1', 'Hospitalized NICU');
  const q4_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('4_1_2', 'Hospitalised Paed');
  const q4_1: SpecializedGroup<string, string, NumericQuestion<string, string>> = new SpecializedGroup<string, string, NumericQuestion<string, string>>('4_1', 'Departments', q4_1_1, q4_1_2);
  const q4: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('4', 'Hospitalized', q4_1);

  // Question 5 "Discharged alive"
  const q5_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('5_1_1', '# Discharged from NICU');
  const q5_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('5_1_2', '# Discharged from elsewhere');
  const q5_1: SpecializedGroup<string, string, NumericQuestion<string, string>> = new SpecializedGroup<string, string, NumericQuestion<string, string>>('5_1', 'By Department', q5_1_1, q5_1_2);
  const q5: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('5', 'Discharged Alive', q5_1);

  // Question 6 "Died before 48h"
  const q6_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('6_1_1', 'Died in NICU');
  const q6_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('6_1_2', 'Died in Paed');
  const q6_1: SpecializedGroup<string, string, NumericQuestion<string, string>> = new SpecializedGroup<string, string, NumericQuestion<string, string>>('6_1', 'By Department', q6_1_1, q6_1_2);
  const q6: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('6', 'Died before 48h', q6_1);

  // Question 7 "Died after 48h"
  const q7_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('7_1_1', 'Died in NICU');
  const q7_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('7_1_2', 'Died in Paed');
  const q7_1: SpecializedGroup<string, string, NumericQuestion<string, string>> = new SpecializedGroup<string, string, NumericQuestion<string, string>>('7_1', 'By Department', q7_1_1, q7_1_2);
  const q7: CompositionQuestion<string, string> = new CompositionQuestion<string, string>( '7', 'Died after 48h', q7_1);

  // Questions 8 to 10
  const q8: NumericQuestion<string, string> = new NumericQuestion<string, string>('8', 'Days hospitalised');
  const q9: NumericQuestion<string, string> = new NumericQuestion<string, string>('9', 'Referrals');
  const q10: NumericQuestion<string, string> = new NumericQuestion<string, string>('10', 'Transfers');

  // Question 11 "Self-discharged"
  const q11: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('11', 'Reason for self-discharge');

  // 11_1 "Reason for self-discharge"
  const q11_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('11_1', 'Reason for self-discharge (Group 1)');
  const q11_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_1', 'Finance: Leave as cannot afford care');
  const q11_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_2', 'Finance: Left to avoid paying');
  const q11_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_3', 'Religious/Cultural');
  const q11_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_4', 'Personal/ Family');
  const q11_1_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_5', 'Other');
  q11_1.addAll(q11_1_1, q11_1_2, q11_1_3, q11_1_4, q11_1_5);
  // TODO: Add q11_1 to q11

  // Question 12
  const q12: NumericQuestion<string, string> = new NumericQuestion<string, string>('12', 'Stayed in the ward');

  // Question 13 "Admissions"
  const q13: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('13', 'Where do patients come from?');

  // 13_1 "Where do patients come from?"
  const q13_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('13_1', 'Where do patients come from? (Group 1)');
  const q13_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_1', 'Quarter Morin');
  const q13_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_2', 'Cap Haitian');
  const q13_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_3', 'Department Nord');
  const q13_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_1_4', 'Other departments');
  q13_1.addAll(q13_1_1, q13_1_2, q13_1_3, q13_1_4);
  // TODO: Add q13_1 to q13

  // 13_2 "Age of infant admitted"
  const q13_2: QuestionGroup<string, string> = new QuestionGroup<string, string>('13_2', 'Age of infant admitted');
  const q13_2_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_1', 'Extremely preterm (less than 28 weeks)');
  const q13_2_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_2', 'Very preterm (28 to 32 weeks)');
  const q13_2_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_3', 'Moderate to late preterm (32 to 37 weeks)');
  const q13_2_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_4', 'Full term (37 weeks plus)');
  const q13_2_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_5', 'Older than neonate (>4 weeks old)');
  const q13_2_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_6', 'Age 4 weeks -5');
  const q13_2_7: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_7', 'Age 6-11');
  const q13_2_8: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_2_8', 'Age 12-18');
  q13_2.addAll(q13_2_1, q13_2_2, q13_2_3, q13_2_4, q13_2_5, q13_2_6, q13_2_7, q13_2_8);
  // TODO: Add q13_2 to q13

  // 13_3 "Gender"
  // const q13_3: QuestionGroup<string, string> = new QuestionGroup<string, string>('Gender', '13_3');
  const q13_3_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_3_1', 'Male');
  const q13_3_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_3_2', 'Female');
  q13_1.addAll(q13_3_1, q13_3_2);
  // TODO: Add q13_3 to q13

  // 13_4 "Main Condition"
  const q13_4: QuestionGroup<string, string> = new QuestionGroup<string, string>('13_4', 'Main condition');
  const q13_4_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_1', 'Respiratory arrest');
  const q13_4_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_2', 'Traumatic injury');
  const q13_4_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_3', 'Septic Shock');
  const q13_4_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_4', 'Hypovolemic shock');
  const q13_4_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_5', 'Seizures/convulsions');
  const q13_4_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_6', 'Poisoning');
  const q13_4_7: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_7', 'Altered mental status');
  const q13_4_8: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_8', 'Gastroenteritis');
  const q13_4_9: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_9', 'Hemorrhage');
  const q13_4_10: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_10', 'Hypothermia');
  const q13_4_11: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_11', 'Cardiac congenital anomaly');
  const q13_4_12: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_12', 'Other congenital anomaly');
  const q13_4_13: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_13', 'Malnutrition');
  const q13_4_14: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_14', 'Meningitis');
  const q13_4_15: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_15', 'Community acquired pneumonia');
  const q13_4_16: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_16', 'Aspiration pneumonia');
  const q13_4_17: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_17', 'Moderate prematurity (32-36 weeks gestation)');
  const q13_4_18: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_18', 'Severe prematurity (<32 weeks)');
  const q13_4_19: NumericQuestion<string, string> = new NumericQuestion<string, string>('13_4_19', 'Other');
  q13_4.addAll(q13_4_1, q13_4_2, q13_4_3, q13_4_4, q13_4_5, q13_4_6, q13_4_7, q13_4_8, q13_4_9, q13_4_10, q13_4_11, q13_4_12, q13_4_13, q13_4_14, q13_4_15, q13_4_16, q13_4_17, q13_4_18, q13_4_19);
  // TODO: Add q13_4 to q13

  // Question 14 "Number of outpatients"
  const q14: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('14', 'Number of outpatients');

  // 14_1 "Age"
  const q14_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('14_1', 'Age');
  const q14_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_1,', 'Extremely preterm (less than 28 weeks)');
  const q14_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_2,', 'Very preterm (28 to 32 weeks)');
  const q14_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_3,', 'Moderate to late preterm (32 to 37 weeks)');
  const q14_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_4,', 'Full term (37 weeks plus)');
  const q14_1_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_5,', 'Older than neonate (>4 weeks old)');
  const q14_1_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_6,', 'Age 4 weeks -5');
  const q14_1_7: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_7,', 'Age 6-11');
  const q14_1_8: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_1_8,', 'Age 12-18');
  q14_1.addAll(q14_1_1, q14_1_2, q14_1_3, q14_1_4, q14_1_5, q14_1_6, q14_1_7, q14_1_8);
  // TODO: Add q14_1 to q14

  // 14_2 "Main Condition"
  const q14_2: QuestionGroup<string, string> = new QuestionGroup<string, string>('14_2', 'Main condition');
  const q14_2_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_1', 'Respiratory arrest');
  const q14_2_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_2', 'Traumatic injury');
  const q14_2_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_3', 'Septic Shock');
  const q14_2_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_4', 'Hypovolemic shock');
  const q14_2_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_5', 'Seizures/convulsions');
  const q14_2_6: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_6', 'Poisoning');
  const q14_2_7: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_7', 'Altered mental status');
  const q14_2_8: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_8', 'Gastroenteritis');
  const q14_2_9: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_9', 'Hemorrhage');
  const q14_2_10: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_10', 'Hypothermia');
  const q14_2_11: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_11', 'Cardiac congenital anomaly');
  const q14_2_12: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_12', 'Other congenital anomaly');
  const q14_2_13: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_13', 'Malnutrition');
  const q14_2_14: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_14', 'Meningitis');
  const q14_2_15: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_15', 'Community acquired pneumonia');
  const q14_2_16: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_16', 'Aspiration pneumonia');
  const q14_2_17: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_17', 'Moderate prematurity (32-36 weeks gestation)');
  const q14_2_18: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_18', 'Severe prematurity (<32 weeks)');
  const q14_2_19: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_2_19', 'Other');
  q14_2.addAll(q14_2_1, q14_2_2, q14_2_3, q14_2_4, q14_2_5, q14_2_6, q14_2_7, q14_2_8, q14_2_9, q14_2_10, q14_2_11, q14_2_12, q14_2_13, q14_2_14, q14_2_15, q14_2_16, q14_2_17, q14_2_18, q14_2_19);
  // TODO: Add q14_2 to q14

  // 14_3 "Gender"
  const q14_3: QuestionGroup<string, string> = new QuestionGroup<string, string>('14_3', 'Gender');
  const q14_3_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_3_1', 'Male');
  const q14_3_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('14_3_2', 'Female');
  q14_3.addAll(q14_3_1, q14_3_2);
  // TODO: Add q14_3 to q14

  nicuPaedsReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14);
  return nicuPaedsReport;
};

export const buildMaternityMockReport = (): QuestionGroup<string, string> => {
  const reportID: string = 'maternity-report_1';
  const maternityReport: QuestionGroup<string, string> = new QuestionGroup<string, string>(reportID, 'Maternity Report');

  // Questions 1 to 5
  const q1: NumericQuestion<string, string> = new NumericQuestion<string, string>('1', 'Beds available');
  const q2: NumericQuestion<string, string> = new NumericQuestion<string, string>('2', 'Beds days');
  const q3: NumericQuestion<string, string> = new NumericQuestion<string, string>('3', 'Patient days');
  const q4: NumericQuestion<string, string> = new NumericQuestion<string, string>('4', 'Hospitalized');
  const q5: NumericQuestion<string, string> = new NumericQuestion<string, string>('5', 'Discharged alive');

  // Question 6 "Died before 48h"
  const q6: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('6', 'Died before 48h', questionIdGeneratorBuilder('6'));
  const q6_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('6_1', 'Age');
  const q6_2: TextQuestion<string, string> = new TextQuestion<string, string>('6_2', 'Cause of death');
  q6.addAllToTemplate(q6_1, q6_2);

  // Question 7 "Died after 48h"
  const q7: ExpandableQuestion<string, string> = new ExpandableQuestion<string, string>('7', 'Died after 48h', questionIdGeneratorBuilder('7'));
  const q7_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('7_1', 'Age');
  const q7_2: TextQuestion<string, string> = new TextQuestion<string, string>('7_2', 'Cause of death');
  q7.addAllToTemplate(q7_1, q7_2);

  // Questions 8 to 10
  const q8: NumericQuestion<string, string> = new NumericQuestion<string, string>('8', 'Days hospitalised');
  const q9: NumericQuestion<string, string> = new NumericQuestion<string, string>('9', 'Referrals');
  const q10: NumericQuestion<string, string> = new NumericQuestion<string, string>('10', 'Transfers');

  // Question 11 "Self-discharged"
  const q11: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('11', 'Self-discharged');

  // 11_1 "Reason for self-discharged"
  const q11_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('11_1', 'Reason for self-discharged');
  const q11_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_1', 'Finance: Leave as cannot afford care');
  const q11_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_2', 'Finance: Left to avoid paying');
  const q11_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_3', 'Religious/Cultural');
  const q11_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_4', 'Personal/ Family');
  const q11_1_5: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_1_5', 'Other');
  q11_1.addAll(q11_1_1, q11_1_2, q11_1_3, q11_1_4, q11_1_5);
  // TODO: add q11_1 to q11

  // Question 12
  const q12: NumericQuestion<string, string> = new NumericQuestion<string, string>('12', 'Stayed in the ward');

  // Question 13 "Admissions"
  const q13: CompositionQuestion<string, string> = new CompositionQuestion<string, string>('11', 'Admissions');

  // 13_1 "Where do patients come from?"
  const q13_1: QuestionGroup<string, string> = new QuestionGroup<string, string>('11_3', 'Where do patients come from?');
  const q13_1_1: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_3_1', 'Quarter Morin');
  const q13_1_2: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_3_2', 'Cap Haitian');
  const q13_1_3: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_3_3', 'Department Nord');
  const q13_1_4: NumericQuestion<string, string> = new NumericQuestion<string, string>('11_3_4', 'Other departments');
  q13_1.addAll(q13_1_1, q13_1_2, q13_1_3, q13_1_4);
  // TODO: add q13_1 to q13

  // Question 14 Table
  // const q14_rows: string[] = ['Weight <1.5kg', '1.5kg ≤ Weight <2.5kg', '2.5kg and over', 'Not weighed'];
  // const q14_columns: string[] = ['Births', 'Normal', 'Césarienne', 'Instrumentalsé'];
  // TODO: Create question table
  //const q14: NumericTable<string, string> = new NumericTable<string, string>('Deliveries', '14', q14_rows, q14_columns, () => NumericQuestion<string, string>);

  maternityReport.addAll(q1, q2, q3, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13);
  return maternityReport;
};
