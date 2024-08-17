import QuestionCollapse from 'components/collapse/QuestionCollapse';
import { QuestionMap } from 'pages/analytics/Analytics';
import { ChangeEvent } from 'react';
import { Button, Container, Modal } from 'react-bootstrap';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();

  return (
    <Modal show={showModal} onHide={handleCloseModal} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{t('analyticsQuestion')}</Modal.Title>
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
        <Button variant="primary" onClick={handleCloseModal}>
          {t('analyticsDone')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
