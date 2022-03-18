import { Button, Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

interface ModalDeleteProps extends RouteComponentProps {
  onModalClose: any;
  onModalDelete: any;
  currentItem: string;
  show: boolean;
  item: string;
  history: History;
}

const ModalDelete = (props: ModalDeleteProps) => {
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
