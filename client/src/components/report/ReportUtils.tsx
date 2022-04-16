import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonItemAnswer,
} from 'common/json_report';
import * as MockApi from './MockApi';
import { ReportItem, ReportData } from './Report';

export const submitData = async (answers: object, data: JsonReportDescriptor) => {
  /*
   * Here we make a request to server and handle the responses.
   * Todo: refactor
   */
  const assemData = assembleData(answers, data);
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

export function toReportData(data: JsonReportDescriptor): ReportData {
  const newItems = data.items.map((item: JsonReportItem, idx) => {
    const id = item.type + '-' + idx;
    return {
      id: id,
      type: item.type,
      description: item.description,
      answer: item.answer,
      validated: true,
      valid: true,
      errorMessage: '',
    };
  });
  const copy = { ...data };
  copy.items = newItems;
  return copy as ReportData;
}
