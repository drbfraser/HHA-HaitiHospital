import Compressor from 'compressorjs';

const blobToFile = (blob: any): File => {
  return new File([blob], blob.name, { type: blob.type });
};

const imageCompressor = (image: any, actions: any) => {
  console.log(image);
  new Compressor(image, {
    quality: 0.8,
    success: (compressedBlob) => {
      actions(blobToFile(compressedBlob));
    },
  });
};

export { imageCompressor };
