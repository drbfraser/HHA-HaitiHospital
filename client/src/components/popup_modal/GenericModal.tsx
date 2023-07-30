import { Button, Modal } from 'react-bootstrap';

interface ModalGenericProps {
  dataTestId: string;
  onModalClose: any;
  show: boolean;
  message: string;
  item: string;
}

const GenericModal = (props: ModalGenericProps) => {
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

export default GenericModal;
