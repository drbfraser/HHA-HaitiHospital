import { QuestionRow } from 'constants/interfaces';
import { useEffect, useState } from 'react';
import { array } from 'yup';

const QuestionRows = ({ questionItems = [] }: { questionItems: any[] }): JSX.Element => {
  const [questionRowElements, setQuestionRowElements] = useState<QuestionRow[]>([]);

  const underscoreAmount = (str: string): number => {
    return str.replace(/^_/g, '').length
  }

  const processCompositionOrSpecializedQuestion = (specialQuestionItem): QuestionRow[] => {
    let array: QuestionRow[] = [];
    const element: QuestionRow = {
      id: specialQuestionItem.id,
      prompt: specialQuestionItem.prompt,
      answer: specialQuestionItem?.answer,
    };
    array.push(element);
    for (let questionItem of specialQuestionItem.questions) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt,
        answer: questionItem?.answer,
      };
      array.push(element);
    }
  
    return array;
  }
  const processQuestionItem = (questionItems): QuestionRow[] => {
    let array: QuestionRow[] = [];
    
    for (let questionItem of questionItems) {
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt,
        answer: questionItem?.answer,
      };
      array.push(element);
      if (questionItem.__class__ === "CompositionQuestion") {
        console.log("questionItem.__class__ == CompositionQuestion", questionItem)
        for (let nestedQuestionItem of questionItem.compositionGroups) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
          array = array.concat(subArray)
        }
      } 
      if (questionItem.__class__ === "SpecializedGroup") {
        console.log("questionItem.__class__ == SpecializedGroup", questionItem);

        for (let nestedQuestionItem of questionItem.questions) {
          const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
          array = array.concat(subArray)
        }
      }
    }
  
    return array;
  };

  useEffect(() => {
    setQuestionRowElements(processQuestionItem(questionItems));
  }, [questionItems]);

  console.log("questionItems", questionItems)
  return (
    <>
      {questionRowElements.map((questionRow) => (
        <tr key={questionRow.id}>
          <th scope="row">{"\xa0\xa0".repeat(underscoreAmount(questionRow.id))}{questionRow.id}</th>
          <td>{"\xa0\xa0".repeat(underscoreAmount(questionRow.id))}{questionRow.prompt}</td>
          <td>{questionRow.answer}</td>
        </tr>
      ))}
    </>
  );
};

export default QuestionRows;
