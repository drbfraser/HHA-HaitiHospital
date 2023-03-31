import { QuestionGroup, QuestionNode } from '@hha/common';
import {
  CompositionQuestionFormField,
  ExpandableQuestionViewField,
  Group,
  MultiSelectionQuestionFormField,
  NumericQuestionFormField,
  SingleSelectionQuestionFormField,
  TextQuestionFormField,
} from '../question_form_components';

export const QuestionFormFields = ({
  applyReportChanges,
  questions,
  suffixName,
  isTemplate = false,
}: {
  applyReportChanges: () => void;
  questions: QuestionGroup<ID, ErrorType>;
  suffixName: string;
  isTemplate?: boolean;
  readOnly?: boolean;
}) => {
  return (
    <>
      {questions
        .map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
          compositionQuestion: (q) => [q, CompositionQuestionFormField],
          expandableQuestion: (q) => [q, ExpandableQuestionViewField],
          multipleSelectionQuestion: (q) => [q, MultiSelectionQuestionFormField],
          numericQuestion: (q) => [q, NumericQuestionFormField],
          questionGroup: (q) => [q, QuestionFormFields],
          singleSelectionQuestion: (q) => [q, SingleSelectionQuestionFormField],
          textQuestion: (q) => [q, TextQuestionFormField],
        })
        // TODO: Remove "any" type
        .map((tuple: [QuestionNode<ID, ErrorType>, any]) => {
          const [question, FormFieldComponent] = tuple;
          return (
            <FormFieldComponent
              applyReportChanges={applyReportChanges}
              key={`${question.getId()}${suffixName}`}
              question={question}
              setErrorSet={() => {}}
              readOnly
              suffixName={suffixName}
              isTemplate={isTemplate}
            />
          );
        })}
    </>
  );
};

export const ReadonlyReportForm = ({
  applyReportChanges,
  formHandler,
  reportData,
  isTemplate = false,
}: {
  applyReportChanges?: () => void;
  formHandler?: (event: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
  reportData: QuestionGroup<ID, ErrorType>;
  btnText?: string;
  isTemplate?: boolean;
}): JSX.Element => {
  return (
    <div className="mt-3 p-3">
      <h2 className="mb-3">{reportData.getPrompt()}</h2>
      <form onSubmit={formHandler} noValidate>
        <Group isRootNode>
          <QuestionFormFields
            applyReportChanges={applyReportChanges}
            isTemplate={isTemplate}
            questions={reportData}
            suffixName=''
          />
        </Group>
      </form>
    </div>
  );
};
