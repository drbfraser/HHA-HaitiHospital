import { useEffect, useState } from 'react';

import { QuestionRow } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';

const QuestionRows = ({ questionItems = [] }: { questionItems: any[] }): JSX.Element => {
  const [questionRowElements, setQuestionRowElements] = useState<QuestionRow[]>([]);
  const { i18n } = useTranslation();
  const language = i18n.language;

  const underscoreAmount = (str: string): number => {
    return (str.match(/_/g) || []).length;
  };

  useEffect(() => {
    const processCompositionOrSpecializedQuestion = (specialQuestionItem): QuestionRow[] => {
      let array: QuestionRow[] = [];
      const element: QuestionRow = {
        id: specialQuestionItem.id,
        prompt: specialQuestionItem.prompt[language],
        answer: specialQuestionItem?.answer,
      };
      array.push(element);
      for (let questionItem of specialQuestionItem.questions) {
        const element: QuestionRow = {
          id: questionItem.id,
          prompt: questionItem.prompt[language],
          answer: questionItem?.answer,
        };
        array.push(element);
      }

      return array;
    };

    const processQuestionItem = (questionItems): QuestionRow[] => {
      let array: QuestionRow[] = [];

      for (let questionItem of questionItems) {
        const element: QuestionRow = {
          id: questionItem.id,
          prompt: questionItem.prompt[language],
          answer: questionItem?.answer,
        };
        array.push(element);
        if (questionItem.__class__ === 'CompositionQuestion') {
          for (let nestedQuestionItem of questionItem.compositionGroups) {
            const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
            array = array.concat(subArray);
          }
        }
        if (questionItem.__class__ === 'SpecializedGroup') {
          for (let nestedQuestionItem of questionItem.questions) {
            const subArray = processCompositionOrSpecializedQuestion(nestedQuestionItem);
            array = array.concat(subArray);
          }
        }
      }

      return array;
    };

    setQuestionRowElements(processQuestionItem(questionItems));
  }, [language, questionItems]);

  const indent = '\xa0\xa0\xa0';

  return (
    <>
      {questionRowElements.map((questionRow) => (
        <tr key={questionRow.id}>
          <th scope="row" className="text-start">
            {indent.repeat(underscoreAmount(questionRow.id))}
            {questionRow.id.replaceAll('_', '.')}
          </th>
          <td className="text-start">
            {indent.repeat(underscoreAmount(questionRow.id))}
            {questionRow.prompt}
          </td>
          <td>{questionRow.answer}</td>
        </tr>
      ))}
    </>
  );
};

export default QuestionRows;
