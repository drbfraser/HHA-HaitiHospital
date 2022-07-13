import { JsonReportDescriptor, JsonReportItem, JsonReportItems, JsonItemAnswer } from 'common/json_report';
import { uniqueId } from 'lodash';
import { type } from 'os';
import * as MockApi from './MockApi';
import { ItemField, ReportForm, itemFieldToReportItem } from './Report';

export interface Answers {
  [id: number]: string;
}

export const submitData = async (answers: Answers, data: ReportForm) : Promise<JsonReportDescriptor> => {
  /*
   * Here we make a request to server and handle the responses.
   * Todo: refactor
   */
  const assemData = assembleData(data, answers);
  return await MockApi.submitData(assemData, 2000, true);
};

export const assembleData = (data: ReportForm, answers: Answers): JsonReportDescriptor => {
  const reportItemsWithAnswers : JsonReportItems = data.itemFields
    .map((itemField: ItemField): JsonReportItem => {
    const answer : Array<JsonItemAnswer> = answers[itemField.id];
    const jsonReportItem : JsonReportItem = { ...itemField.reportItem, answer };
    return jsonReportItem;
  }); 
  const reportDescriptor = { ...data.jsonDescriptor, reportItemsWithAnswers };
  return reportDescriptor;
};

export function toReportData(data: JsonReportDescriptor): ReportForm {
  const jsonReportItemToItemField = (item: JsonReportItem): ItemField => {
    return {
      // parse from json to id when server supports id for item.
      reportItem: item,
      id: uniqueId(),
      validated: true,
      valid: true,
      errorMessage: '',
      items: item.items?.map(jsonReportItemToItemField) ?? undefined
    };
  }
  const itemFields : Array<ItemField> = data.items.map(jsonReportItemToItemField);
  const reportForm: ReportForm = { jsonDescriptor: data, itemFields: itemFields};
  return reportForm;
}
