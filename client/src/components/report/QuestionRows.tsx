import { useEffect, useState } from 'react';

import { QuestionRow } from 'constants/interfaces';
import { useTranslation } from 'react-i18next';
import { underscoreAmount } from './utils';
import { QUESTION_FOR_REGEX } from 'constants/strings';

export const processCompositionOrSpecializedQuestion = (
  specialQuestionItem: any,
  language: string,
): QuestionRow[] => {
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

export const processTableQuestion = (tableItem: any, language: string): QuestionRow[] => {
  let array: QuestionRow[] = [];
  const questionTable = tableItem.questionTable;
  for (let questionRows of questionTable) {
    for (let tableCell of questionRows) {
      const questionItem = tableCell.question;
      const element: QuestionRow = {
        id: questionItem.id,
        prompt: questionItem.prompt[language].replace(QUESTION_FOR_REGEX, ''),
        answer: questionItem?.answer,
      };
      array.push(element);
    }
  }
  return array;
};

const QuestionRows = ({ questionItems = [] }: { questionItems: any[] }): JSX.Element => {
  const [questionRowElements, setQuestionRowElements] = useState<QuestionRow[]>([]);
  const { i18n } = useTranslation();
  const language = i18n.resolvedLanguage;

  useEffect(() => {
    const processQuestionItem = (questionItems: any): QuestionRow[] => {
      let array: QuestionRow[] = [];

      for (let questionItem of questionItems) {
        if (questionItem.__class__ === 'NumericTable') {
          const element: QuestionRow = {
            id: questionItem.id,
            prompt: questionItem.tableTitle[language].replace(/\d+/g, ''),
            answer: questionItem?.answer,
          };
          array.push(element);
          const subQuestionArray = processTableQuestion(questionItem, language);
          array = array.concat(subQuestionArray);
        } else {
          const element: QuestionRow = {
            id: questionItem.id,
            prompt: questionItem.prompt[language],
            answer: questionItem?.answer,
          };
          array.push(element);
          if (questionItem.__class__ === 'CompositionQuestion') {
            for (let nestedQuestionItem of questionItem.compositionGroups) {
              const subArray = processCompositionOrSpecializedQuestion(
                nestedQuestionItem,
                language,
              );
              array = array.concat(subArray);
            }
          }
          if (questionItem.__class__ === 'SpecializedGroup') {
            for (let nestedQuestionItem of questionItem.questions) {
              const subArray = processCompositionOrSpecializedQuestion(
                nestedQuestionItem,
                language,
              );
              array = array.concat(subArray);
            }
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
