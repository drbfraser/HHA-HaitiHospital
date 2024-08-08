import { QuestionPromptUI } from 'pages/analytics/Analytics';
import { ChangeEvent, useState } from 'react';
import { Col, Collapse, Row, Container } from 'react-bootstrap';
import './QuestionCollapse.css';
import { formatQuestion, reformatQuestionPrompt } from 'utils/string';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';

type QuestionCollapseProps = {
  department: string;
  questionPrompts: QuestionPromptUI[];
  setQuestionPrompts: (event: ChangeEvent<HTMLInputElement>) => void;
};

const QuestionCollapse = ({
  department,
  questionPrompts,
  setQuestionPrompts,
}: QuestionCollapseProps) => {
  const [open, setOpen] = useState(false);

  const { t, i18n } = useTranslation();

  return (
    <Container>
      <Col
        onClick={() => setOpen(!open)}
        className="question-col d-flex align-items-center"
        style={{ width: '100%', height: '50px' }}
      >
        <i
          className={classNames(
            'bi mr-3',
            { 'bi-chevron-right': !open },
            { 'bi-chevron-down': open },
          )}
          style={{ fontSize: '18px' }}
        ></i>
        <span>{t(`departments.${department}`)}</span>
      </Col>

      <Collapse in={open} className="px-5">
        <div>
          {questionPrompts.map((questionPrompt, index) => (
            <Col className="d-flex align-items-center" key={index}>
              <input
                //we use this id to uniquely identify a question across departments
                id={`${department}-${questionPrompt.id}`}
                type="checkbox"
                className="mr-3"
                style={{ width: '15px', height: '15px' }}
                checked={questionPrompt.checked}
                onChange={setQuestionPrompts}
              ></input>

              <span>{formatQuestion(questionPrompt, i18n.language)}</span>
            </Col>
          ))}
        </div>
      </Collapse>
    </Container>
  );
};

export default QuestionCollapse;
