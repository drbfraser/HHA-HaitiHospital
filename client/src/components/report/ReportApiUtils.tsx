import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportItemMeta,
  JsonItemAnswer,
} from 'common/definitions/json_report';
import { getDepartmentName } from 'common/utils/departments';
import { toast } from 'react-toastify';
import * as MockApi from './MockApi';

export const submitHandler = async (
  answers: object,
  data: JsonReportDescriptor,
  setData: React.Dispatch<React.SetStateAction<JsonReportDescriptor>>,
  setReadOnly: React.Dispatch<React.SetStateAction<boolean>>,
) => {
  /*
   * Here we make a request to server and handle the responses.
   * Todo: refactor
   */
  try {
    const result = await MockApi.submitData(assembleData(answers, data), 1000, true);
    setData(result);
    setReadOnly(true);
    toast.success('Data submited');
  } catch (errorData) {
    setData(errorData.data);
    setReadOnly(false);
    toast.error(errorData.message);
  }
};

const assembleData = (answers, data): JsonReportDescriptor => {
  const copy = { ...data };
  copy.items = copy.items.map((item) => {
    const answer = answers[item.meta.id];
    const itemCopy = { ...item };
    itemCopy.answer = [[answer]];
    return itemCopy;
  });
  return copy;
};
