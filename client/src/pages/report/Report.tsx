import SideBar from 'components/side_bar/side_bar';
import Header from 'components/header/header';
import { buildRehabMockReport, QuestionGroup, QuestionNode } from "@hha/common"
import { buildQuestionFormField } from 'components/report/question_form_fields';

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
          <form className='col-md-6'>
            {questions.map((q) => buildQuestionFormField(q))}
          </form>
        </div>
      </main>
    </div>
  )
}
