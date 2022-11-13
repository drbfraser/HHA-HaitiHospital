import {  QuestionNode, NumericQuestion, ExpandableQuestion, TextQuestion } from "@hha/common"
import { ReactElement, useState } from 'react';
import './styles.css';

export const buildQuestionFormField = (question: QuestionNode): ReactElement => {
  if (question instanceof NumericQuestion) {
    return <NumericQuestionFormField key={question.id} question={question} />
  } else if (question instanceof ExpandableQuestion) {
    return <ExpandableQuestionFormField key={question.id} question={question} />
  } else if (question instanceof TextQuestion) {
    return <TextQuestionFormField key={question.id} question={question} />
  } else {
    return <p key={question.id}>(WIP) Non-supported question type</p>
  }
}

const FormField = ({children}) => {
  return <fieldset className="mb-3">
    {children}
  </fieldset>
}

const FormFieldLabel = ({id, prompt}) => {
  const orderedLabel = id.replaceAll('_', '.')

  return <label htmlFor={id} className='form-label'>{orderedLabel}. {prompt}</label>
}

const NumericQuestionFormField = ({question}: NumericQuestion) => {
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

const TextQuestionFormField = ({question}: TextQuestion) => {

  return <FormField>
    <FormFieldLabel id={question.id} prompt={question.prompt} />
    <input
      className="form-control w-fit"
      type="text"
      defaultValue={question.answer}
    />
  </FormField>
}


const ExpandableQuestionFormField = ({question}: ExpandableQuestion) => {
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
