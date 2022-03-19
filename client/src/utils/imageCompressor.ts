import Compressor from 'compressorjs';

const handleCompressedUpload = (event: any) => {
  const image = event.target.files[0];
  new Compressor(image, {
    quality: 0.8,
    success: (compressedResult) => {
      return compressedResult;
    },
  });
};

export { handleCompressedUpload };
