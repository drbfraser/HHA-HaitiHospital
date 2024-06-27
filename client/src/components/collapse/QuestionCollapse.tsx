import { QuestionPromptUI } from 'pages/analytics/Analytics';
import { ChangeEvent, useState } from 'react';
import { Col, Collapse, Row, Container } from 'react-bootstrap';
import './QuestionCollpase.css';
import { reformatQuestionPrompt } from 'utils/string';

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

  return (
    <Container>
      <Col
        onClick={() => setOpen(!open)}
        className="question-col d-flex align-items-center"
        style={{ width: '100%', height: '50px' }}
      >
        <i className="bi bi-chevron-right mr-3" style={{ fontSize: '18px' }}></i>
        <span>{department}</span>
      </Col>

      <Collapse in={open} className="px-5">
        <div>
          {questionPrompts.map((questionPrompt, index) => (
            <Col className="d-flex align-items-center" key={index}>
              <input
                id={`${department}-${questionPrompt.id}`}
                type="checkbox"
                className="mr-3"
                style={{ width: '15px', height: '15px' }}
                checked={questionPrompt.checked}
                onChange={setQuestionPrompts}
              ></input>

              <span>{reformatQuestionPrompt(questionPrompt.id, questionPrompt.en)}</span>
            </Col>
          ))}
        </div>
      </Collapse>
    </Container>
  );
};

export default QuestionCollapse;
