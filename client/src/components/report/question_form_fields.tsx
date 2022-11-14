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

const FormField = ({children}): JSX.Element => {
  return <fieldset className="mb-3">
    {children}
  </fieldset>
}

const FormFieldLabel = ({id, prompt}): JSX.Element => {
  const orderedLabel = id.replaceAll('_', '.')

  return <label htmlFor={id} className='form-label'>{orderedLabel}. {prompt}</label>
}

const PlaceholderFormField = ({question}: NumericQuestion): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    <p>(WIP) Non-supported question type</p>
  </FormField>
}

const NumericQuestionFormField = ({question}: NumericQuestion): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    <input
      className="form-control w-fit"
      type="number"
      min="0"
      defaultValue={question.answer}
    />
  </FormField>
}

const TextQuestionFormField = ({question}: TextQuestion): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    <input
      className="form-control w-fit"
      type="text"
      defaultValue={question.answer}
    />
  </FormField>
}


const ExpandableQuestionFormField = ({question}: ExpandableQuestion): JSX.Element => {
  const [numberOfItems, setNumberOfItems] = useState(0)

  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    <input className='col-sm form-control w-fit' type='number' min="0" defaultValue={numberOfItems} onChange={(e) => setNumberOfItems(parseInt(e.target.value))} />
    <div>
      {Array.from({length: numberOfItems}, (_, index) => {
        return (
          <fieldset key={index} className='mt-3'>
            <h6 className='uppercase text-lg'>Item {index + 1}</h6>
            {question.questionsTemplate.questionItems.map((q) => buildQuestionFormField(q))}
          </fieldset>
        )
      })}
    </div>
  </FormField>
}

const SingleSelectionQuestionFormField = ({question}: SingleSelectionQuestion) => {
  const [currentSelection, setCurrentSelection] = useState(question.answer || 0)

  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    {question.choices.map(({chosen, description}, index) =>
      <div key={`${question.id}-${index}`}>
        <input 
          id={`${question.id}-${index}`} 
          className='radio' 
          name={question.prompt} 
          key={question.id + index} 
          type="radio" 
          checked={index === currentSelection} 
          onChange={() => {
            question.setAnswer(index)
            setCurrentSelection(index)}
          } 
        /> 
        &nbsp;<label htmlFor={`${question.id}-${index}`}>{description}</label>
      </div>
    )}
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
    FormFieldComponent: SingleSelectionQuestionFormField
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

export const buildQuestionFormField = (question: QuestionNode): JSX.Element => {
  const { className, FormFieldComponent } = Object.values(questionFormFieldMapper).find((classNameMap) => classNameMap.className === question.constructor.name);

  return <FormFieldComponent key={question.id} question={question} />
}
