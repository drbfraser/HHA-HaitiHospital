import { QuestionPrompt } from '@hha/common';
import QuestionCollapse from 'components/collapse/QuestionCollapse';
import { QuestionMap, QuestionPromptUI } from 'pages/analytics/Analytics';
import { ChangeEvent, useState } from 'react';
import { Button, Container, Form, Row } from 'react-bootstrap';
import { Col, InputGroup, ListGroup, Modal } from 'react-bootstrap';
import { reformatQuestionPrompt } from 'utils/string';

type AnalyticsQuestionModalProps = {
  showModal: boolean;
  questionMap: QuestionMap;
  handleCloseModal: () => void;
  setQuestionSelected: (event: ChangeEvent<HTMLInputElement>) => void;
};

export const AnalyticsQuestionModal = ({
  showModal,
  questionMap,
  handleCloseModal,
  setQuestionSelected,
}: AnalyticsQuestionModalProps) => {
  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          <div className="d-flex flex-column" style={{ overflowY: 'auto', height: '300px' }}>
            {Object.keys(questionMap).map((departmentKey, index) => (
              <QuestionCollapse
                department={departmentKey}
                key={index}
                questionPrompts={questionMap[departmentKey]}
                setQuestionPrompts={setQuestionSelected}
              />
            ))}
          </div>
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
