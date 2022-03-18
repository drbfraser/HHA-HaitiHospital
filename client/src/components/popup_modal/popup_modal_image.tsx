import { Image, Modal } from 'react-bootstrap';
import { RouteComponentProps } from 'react-router-dom';
import { History } from 'history';

interface ModalImageProps extends RouteComponentProps {
  onModalClose: any;
  show: boolean;
  image: string;
  item: string;
  history: History;
}

const ModalImage = (props: ModalImageProps) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Modal.Header closeButton></Modal.Header>
      <Image src={props.image} alt={props.item}></Image>
    </Modal>
  );
};

export default ModalImage;
