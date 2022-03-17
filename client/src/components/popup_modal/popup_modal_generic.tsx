import { Button, Modal } from 'react-bootstrap';

const ModalGeneric = (props: any) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>REMINDER</Modal.Title>
      </Modal.Header>
      <Modal.Body>{props.message}</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-primary" onClick={() => props.onModalClose()}>
          Ok
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalGeneric;
