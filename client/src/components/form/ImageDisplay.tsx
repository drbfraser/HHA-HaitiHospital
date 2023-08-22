import { Image } from 'react-bootstrap';
import ImageModal from 'components/popup_modal/ImageModal';
import { useState } from 'react';

interface ImageDisplayProps {
  image: string;
  altMessage?: string;
  className?: string;
}

export const ImageDisplay = ({
  image,
  altMessage = 'Image',
  className = 'align-items-start',
}: ImageDisplayProps) => {
  const [isImageModelOpen, setIsImageModalOpen] = useState<boolean>(false);

  const onEnlargeImage = (event: any) => {
    event.stopPropagation();
    event.preventDefault();
    setIsImageModalOpen(true);
  };

  const onModalImageClose = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className={`d-flex flex-row ${className}`}>
      <Image
        src={image}
        alt={altMessage}
        style={{
          maxWidth: '750px',
          maxHeight: '500px',
          cursor: 'pointer',
          objectFit: 'contain',
        }}
        className={`d-flex mw-100 mx-auto ms-xl-auto mt-3 mb-3`}
        onClick={onEnlargeImage}
      />
      <ImageModal
        show={isImageModelOpen}
        onModalClose={onModalImageClose}
        image={image}
        item={altMessage}
      />
    </div>
  );
};
