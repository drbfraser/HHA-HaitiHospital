import { Image, Modal } from 'react-bootstrap';

interface ModalImageProps {
  onModalClose: any;
  show: boolean;
  image: string;
  item: string;
  size?: 'sm' | 'lg' | 'xl';
}

const ImageModal = ({ show, onModalClose, image, item, size = 'xl' }: ModalImageProps) => {
  return (
    <Modal show={show} onHide={onModalClose} size={size}>
      <Image src={image} alt={item}></Image>
    </Modal>
  );
};

export default ImageModal;
