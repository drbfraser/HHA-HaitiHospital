import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import cn from 'classnames';
import { useTranslation } from 'react-i18next';

interface ComfirmationModalProps {
  messages: (JSX.Element | string)[];
  onModalCancel: () => void;
  onModalProceed: () => void;
  show: boolean;
  title: string;
}

const ConfirmationModal = (props: ComfirmationModalProps) => {
  const { t } = useTranslation();

  return (
    <Modal show={props.show} onHide={props.onModalCancel}>
      <Modal.Header closeButton>
        <Modal.Title>{props.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container fluid>
          {props.messages.map((message, index) => (
            <Row className={cn({ 'mb-3': index !== props.messages.length - 1 })} key={index}>
              <Col>{message}</Col>
            </Row>
          ))}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={props.onModalCancel}>
          {t('button.cancel')}
        </Button>
        <Button variant="primary" onClick={props.onModalProceed}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;
