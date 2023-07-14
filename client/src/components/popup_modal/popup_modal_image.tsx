import { Image, Modal } from 'react-bootstrap';

import { History } from 'history';

interface ModalImageProps {
  onModalClose: any;
  show: boolean;
  image: string;
  item: string;
  history: History;
}

const ModalImage = (props: ModalImageProps) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Image src={props.image} alt={props.item}></Image>
    </Modal>
  );
};

export default ModalImage;
