import { QuestionRow } from 'constants/interfaces';
import { useEffect, useState } from 'react';
import { array } from 'yup';

const QuestionRows = ({ questionItems = [] }: { questionItems: any[] }): JSX.Element => {
  const [questionRowElements, setQuestionRowElements] = useState<QuestionRow[]>([]);

  const processQuestionItem = (questionItems) => {
    let array: QuestionRow[] = [];
    for (let questionItem of questionItems) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt,
        answer: questionItem.answer,
      };

      array.push(element);
    }

    return array;
  };

  // const QuestionRowsElement = (questionRows: QuestionRow[]) => (
  //   <>
  //     {questionRows.map((questionRow) => (
  //       <tr key={questionRow.id}>
  //         <th scope="row">{questionRow.id}</th>
  //         <td>{questionRow.prompt}</td>
  //         <td>{questionRow.answer}</td>
  //       </tr>
  //     ))}
  //   </>
  // );
  useEffect(() => {
    setQuestionRowElements(processQuestionItem(questionItems));
    console.log('Lah', questionRowElements);
  }, [questionItems]);

  return (
    <>
      {questionRowElements.map((questionRow) => (
        <tr key={questionRow.id}>
          <th scope="row">{questionRow.id}</th>
          <td>{questionRow.prompt}</td>
          <td>{questionRow.answer}</td>
        </tr>
      ))}
    </>
  );
};

export default QuestionRows;
