import SideBar from '../side_bar/side_bar';
import Header from 'components/header/header';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { buildRehabMockReport, QuestionGroup, QuestionNode, NumericQuestion } from "@hha/common"
import { ReactElement } from 'react';

const buildQuestionFormField = (question: QuestionNode): ReactElement => {
  const questionId: string = question.id

  if (question instanceof NumericQuestion) {
    return buildNumericQuestionFormField(question)
  } else {
    return <input key={questionId} type='text' />
  }
}

const buildNumericQuestionFormField = ({id, answer, prompt, validators}: NumericQuestion): ReactElement => {

  return <div key={id} className="mb-3">
    <label htmlFor="" className="form-label">
      {prompt}
    </label>
    <input
      className="form-control"
      type="text"
      defaultValue={answer}
    />
  </div>
  
}

export const Report = () => {

  const report: QuestionGroup<string, string> = buildRehabMockReport()
  const questions: Array<QuestionNode> = report.questionItems

  return (
    <div className="department">
      <SideBar />
      <main className="container-fluid main-region">
        <Header />
        <div className="mt-3">
          <section><h1 className="text-start">Rehab Report</h1></section>
          <form>
            {questions.map((q) => buildQuestionFormField(q))}
          </form>
        </div>
      </main>
    </div>
  )
}
