import { Image, Modal } from 'react-bootstrap';

const ModalImage = (props: any) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton></Modal.Header>
      <Image src={props.image} alt={props.item}></Image>
    </Modal>
  );
};

export default ModalImage;
