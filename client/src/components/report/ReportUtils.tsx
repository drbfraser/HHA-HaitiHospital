import {
  JsonReportDescriptor,
  JsonItemAnswer,
} from 'common/definitions/json_report';
import { getDepartmentName } from 'common/definitions/departments';
import { toast } from 'react-toastify';
import * as MockApi from './MockApi';
import { ReportItem } from './Report';

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
    const assemData = assembleData(answers, data)
    const result = await MockApi.submitData(assemData, 5000, false);
    setData(result);
    setReadOnly(true);
    toast.success('Data submited');
  } catch (errorData) {
    setData(errorData.data);
    setReadOnly(false);
    toast.error(errorData.message);
  }
};

const assembleData = (answers: object, data: JsonReportDescriptor): JsonReportDescriptor => {
  const copy = { ...data };
  copy.items = copy.items.map((item) => {
    const answer = answers[(item as ReportItem).id];
    const itemCopy = { ...item };
    itemCopy.answer = [[answer]];
    return itemCopy;
  });
  return copy;
};
