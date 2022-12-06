import { Button, Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

interface ModalGenericProps extends RouteComponentProps {
  dataTestId: string;
  onModalClose: any;
  show: boolean;
  message: string;
  item: string;
  history: History;
}

const ModalGeneric = (props: ModalGenericProps) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>REMINDER</Modal.Title>
      </Modal.Header>
      <Modal.Body data-testid={props.dataTestId}>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => props.onModalClose()}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGeneric;
