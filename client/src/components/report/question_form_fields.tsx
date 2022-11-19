import { NumericQuestion, ExpandableQuestion, TextQuestion, CompositionQuestion, MultipleSelectionQuestion, SingleSelectionQuestion, QuestionGroup, QuestionNode } from "@hha/common"
import { useState } from 'react';
import './styles.css';

type FunctionalComponent = (object: Object) => JSX.Element;

// Temporary placeholders
// TODO: Decide on an appropriate types for those
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

const PlaceholderFormField = ({question}: {question: QuestionNode<ID, ErrorType>}): JSX.Element => {
  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <p>(WIP) Non-supported question type</p>
  </FormField>
}

const NumericQuestionFormField = ({question}: {question: NumericQuestion<ID, ErrorType>}): JSX.Element => {
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

const TextQuestionFormField = ({question}: {question: TextQuestion<ID, ErrorType>}): JSX.Element => {

  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <input
      className="form-control w-fit"
      type="text"
      defaultValue={question.getAnswer()}
    />
  </FormField>
}


export const buildQuestionFormField = (questions: QuestionGroup<ID, ErrorType>): JSX.Element => {
  return <FormField> {questions.map<[QuestionNode<ID, ErrorType>, FunctionalComponent]>({
    textQuestion: (q) => [q, TextQuestionFormField],
    numericQuestion: (q) => [q, NumericQuestionFormField],
    singleSelectionQuestion: (q) => [q, PlaceholderFormField],
    multipleSelectionQuestion: (q) => [q, PlaceholderFormField],
    questionGroup: (q) => [q, buildQuestionFormField],
    compositionQuestion: (q) => [q, PlaceholderFormField],
    expandableQuestion: (q) => [q, ExpandableQuestionFormField],
  }).map((tuple) => {
    const question: QuestionNode<ID, ErrorType> = tuple[0];
    const FormFieldComponent: any = tuple[1];
    
    return <FormFieldComponent key={question.getId()} question={question} />
  })} </FormField>;
}

const ExpandableQuestionFormField = ({question} : {question: ExpandableQuestion<ID, ErrorType>}): JSX.Element => {
  const [elements, setElements] = useState([])

  return <FormField>
    <FormFieldLabel id={question.getId()} prompt={question.getPrompt()} />
    <input className='col-sm form-control w-fit' type='number' min="0" defaultValue={0} onChange={(e) => {
      question.setAnswer(parseInt(e.target.value));
      let index = 1;
      setElements(question.map<JSX.Element>((questions) => {
          return (
          <fieldset key={index} className='mt-3'>
            <h6 className='uppercase text-lg'>Item {index++}</h6>
            {buildQuestionFormField(questions)}
          </fieldset>
        );
      }));
    }} />
    <div>
      { elements }
    </div>
  </FormField>
}