import { Image, Modal } from 'react-bootstrap';

interface ModalImageProps {
  onModalClose: any;
  show: boolean;
  image: string;
  item: string;
}

const ImageModal = (props: ModalImageProps) => {
  return (
    <Modal show={props.show} onHide={props.onModalClose}>
      <Image src={props.image} alt={props.item}></Image>
    </Modal>
  );
};

export default ImageModal;
