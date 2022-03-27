import {
  JsonReportDescriptor,
  JsonItemAnswer,
} from 'common/definitions/json_report';
import { getDepartmentName } from 'common/definitions/departments';
import { toast } from 'react-toastify';
import * as MockApi from './MockApi';
import { ReportItem, ReportData } from './Report';

export const submitData = async (
  answers: object,
  data: JsonReportDescriptor,
) => {
  /*
   * Here we make a request to server and handle the responses.
   * Todo: refactor
   */
    const assemData = assembleData(answers, data)
    return await MockApi.submitData(assemData, 2000, true);
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
