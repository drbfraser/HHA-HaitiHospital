import Api from 'actions/Api';
import { History } from 'history';
import { ENDPOINT_IMAGE_BY_PATH } from 'constants/endpoints';

export const getImage = async (imgPath: string, history: History): Promise<string> => {
  try {
    const imagePath = await Api.Image(ENDPOINT_IMAGE_BY_PATH(imgPath), history);
    return imagePath;
  } catch (error) {
    console.error('Error getting biomech image:', error);
    throw error;
  }
};
