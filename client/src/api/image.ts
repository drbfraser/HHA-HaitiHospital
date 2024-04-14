import Api from 'actions/Api';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';
import { History } from 'history';

export const getImage = async (imgPath: string, history: History): Promise<string> => {
  try {
    const imagePath = await Api.Image(ENDPOINT_IMAGE_BY_PATH(imgPath), history);
    return imagePath;
  } catch (error) {
    console.error('Error getting biomech image:', error);
    throw error;
  }
};
