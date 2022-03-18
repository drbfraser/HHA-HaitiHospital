import { Button, Modal } from 'react-bootstrap';

interface ModalGenericProps extends RouteComponentProps {
  onModalClose: any;
  show: boolean;
  message: string;
  item: string;
  history: History;
}

const ModalDelete = (props: any) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton>
        <Modal.Title>WARNING</Modal.Title>
      </Modal.Header>
      <Modal.Body>{`Are you sure you want to delete this ${props.item}`}?</Modal.Body>
      <Modal.Footer>
        <Button variant="outline-dark" onClick={() => props.onModalClose()}>
          Cancel
        </Button>
        <Button variant="outline-danger" onClick={() => props.onModalDelete(props.currentItem)}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDelete;
