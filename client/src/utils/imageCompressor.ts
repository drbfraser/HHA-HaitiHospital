import Compressor from 'compressorjs';

const blobToFile = (blob: Blob, name: string): File => {
  return new File([blob], name, { type: blob.type });
};

const imageCompressor = (image: File, okActions: (result: File) => void) => {
  new Compressor(image, {
    quality: 0.8,
    success: (result) => {
      if (result instanceof File) okActions(result)
      else okActions(blobToFile(result, image.name));
    },
    error: (e: Error) => { console.log(e); }
  });
};

export { imageCompressor };
