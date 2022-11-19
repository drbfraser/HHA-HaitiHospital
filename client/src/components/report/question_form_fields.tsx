import {  QuestionNode, NumericQuestion, ExpandableQuestion, TextQuestion, CompositionQuestion, MultipleSelectionQuestion, SingleSelectionQuestion, QuestionGroup } from "@hha/common"
import { useState } from 'react';
import './styles.css';

interface QuestionFormFieldHandlerEntry<ID, ErrorType> {
  readonly className: string;
  readonly FormFieldComponent: (question: QuestionNode<ID, ErrorType>) => JSX.Element;
}

interface QuestionFormFieldHandlerMap<ID, ErrorType> {
  readonly textQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly numericQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly singleSelectionQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly multipleSelectionQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly questionGroup: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly compositionQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
  readonly expandableQuestion: QuestionFormFieldHandlerEntry<ID, ErrorType>;
}

// Temporary placeholders
type ID = string;
type ErrorType = string;

const FormField = ({children}): JSX.Element => {
  return <fieldset className="mb-3">
    {children}
  </fieldset>
}

const FormFieldLabel = ({id, prompt}): JSX.Element => {
  const orderedLabel = id.replaceAll('_', '.')

  return <label htmlFor={id} className='form-label'>{orderedLabel}. {prompt}</label>
}

const PlaceholderFormField = (question: NumericQuestion<ID, ErrorType>): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <p>(WIP) Non-supported question type</p>
  </FormField>
}

const NumericQuestionFormField = (question: NumericQuestion<ID, ErrorType>): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <input
      className="form-control w-fit"
      type="number"
      min="0"
      defaultValue={question.getAnswer()}
    />
  </FormField>
}

const TextQuestionFormField = (question: TextQuestion<ID, ErrorType>): JSX.Element => {

  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <input
      className="form-control w-fit"
      type="text"
      defaultValue={question.getAnswer()}
    />
  </FormField>
}


const ExpandableQuestionFormField = (question: ExpandableQuestion<ID, ErrorType>): JSX.Element => {
  const [numberOfItems, setNumberOfItems] = useState(0)

  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <input className='col-sm form-control w-fit' type='number' min="0" defaultValue={numberOfItems} onChange={(e) => setNumberOfItems(parseInt(e.target.value))} />
    <div>
      {Array.from({length: numberOfItems}, (_, index) => {
        return (
          <fieldset key={index} className='mt-3'>
            <h6 className='uppercase text-lg'>Item {index + 1}</h6>
            {/* Fix in a follow-up MR */}
            {/* question.questionsTemplate.questionItems.map((q) => buildQuestionFormField(q)) */}
          </fieldset>
        )
      })}
    </div>
  </FormField>
}

const questionFormFieldMapper: QuestionFormFieldHandlerMap<string, string> = {
  textQuestion: {
    className: TextQuestion.name,
    FormFieldComponent: TextQuestionFormField
  },
  numericQuestion: {
    className: NumericQuestion.name,
    FormFieldComponent: NumericQuestionFormField
  },
  singleSelectionQuestion: {
    className: SingleSelectionQuestion.name,
    FormFieldComponent: PlaceholderFormField
  },
  multipleSelectionQuestion: {
    className: MultipleSelectionQuestion.name,
    FormFieldComponent: PlaceholderFormField
  },
  questionGroup: {
    className: QuestionGroup.name,
    FormFieldComponent: PlaceholderFormField
  },
  compositionQuestion: {
    className: CompositionQuestion.name,
    FormFieldComponent: PlaceholderFormField
  },
  expandableQuestion: {
    className: ExpandableQuestion.name,
    FormFieldComponent: ExpandableQuestionFormField
  },
}

export const buildQuestionFormField = (question: QuestionNode<ID, ErrorType>): JSX.Element => {
  const { className, FormFieldComponent } = Object.values(questionFormFieldMapper).find((classNameMap) => classNameMap.className === question.constructor.name);

  return <FormFieldComponent key={question.getId()} question={question} />
}
