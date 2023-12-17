import Compressor from 'compressorjs';
import i18 from 'i18n';

const blobToFile = (blob: Blob, name: string): File => {
  return new File([blob], name, { type: blob.type });
};

const imageCompressor = (
  image: File,
  okActions: (result: File) => void,
  failedActions?: (e: Error) => void,
) => {
  console.log('image compressor');
  new Compressor(image, {
    quality: 0.8,
    success: (result) => {
      if (result instanceof File) okActions(result);
      else okActions(blobToFile(result, image.name));
    },
    error: failedActions
      ? (e) => {
          console.log(e);
          e.message = i18.t(`error_message.compress.image`);
          failedActions(e);
        }
      : (e) => {
          console.log(e);
        },
  });
};

export { imageCompressor };
