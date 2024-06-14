import { QuestionPrompt } from '@hha/common';
import { ChangeEvent, useState } from 'react';
import { Button, Container, Form } from 'react-bootstrap';
import { Col, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { refornatQuestionPrompt } from 'utils/string';

type AnalyticsQuestionModalProps = {
  showModal: boolean;
  questionPrompts: QuestionPrompt[];
  handleCloseModal: () => void;
  setQuestionSelected: (questionId: string) => void;
};

const getQuestionPromptsFromSearch = (
  questionPrompts: QuestionPrompt[],
  questionSearched: string,
) => {
  return questionPrompts.filter((question) => {
    return question.en.toLowerCase().includes(questionSearched.toLowerCase());
  });
};

export const AnalyticsQuestionModal = ({
  showModal,
  questionPrompts,
  handleCloseModal,
  setQuestionSelected,
}: AnalyticsQuestionModalProps) => {
  const [questionSearched, setQuestionSearched] = useState('');

  const onQuestionSearchChanged = (event: ChangeEvent<HTMLInputElement>) => {
    setQuestionSearched(event.target.value);
  };
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <Col>
            <InputGroup className="mb-3">
              <Form.Control
                placeholder="Search for questions"
                onChange={onQuestionSearchChanged}
                value={questionSearched}
              />
              <InputGroup.Text>
                <Button variant="outline-dark">Search</Button>
              </InputGroup.Text>
            </InputGroup>
            <ListGroup style={{ overflowY: 'auto', height: '300px' }}>
              {getQuestionPromptsFromSearch(questionPrompts, questionSearched).map(
                (question, index) => {
                  return (
                    <ListGroup.Item
                      key={index}
                      action
                      variant="light"
                      onClick={() => setQuestionSelected(question.id)}
                    >
                      {refornatQuestionPrompt(question.id, question.en)}
                    </ListGroup.Item>
                  );
                },
              )}
            </ListGroup>
          </Col>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleCloseModal}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
