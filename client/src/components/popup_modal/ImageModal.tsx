import { Image, Modal } from 'react-bootstrap';

import { History } from 'history';
import { RouteComponentProps } from 'react-router-dom';

interface ModalImageProps extends RouteComponentProps {
  onModalClose: any;
  show: boolean;
  image: string;
  item: string;
  history: History;
}

const ImageModal = (props: ModalImageProps) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Image src={props.image} alt={props.item}></Image>
    </Modal>
  );
};

export default ImageModal;