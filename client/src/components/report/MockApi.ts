import nicuJSON from '../../pages/form/models/nicuModel.json';
import { v4 as uuid } from 'uuid';
import { ReportData, ReportItem } from './Report';
import {
  JsonReportDescriptor,
  JsonReportItem,
  JsonReportItemMeta,
  JsonItemAnswer,
} from 'common/definitions/json_report';

export const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export function getData(): JsonReportDescriptor {
  const items: ReportItem[] = nicuJSON.flatMap((section, idx) => {
    const fields: ReportItem[] = [];
    fields.push({
      meta: {
        id: 'label' + idx,
        type: 'label',
      },
      description: section.section_label,
      answer: [],
      validated: true,
      valid: true,
      errorMessage: '',
    });
    return fields.concat(
      section.section_fields.map((field, idx): ReportItem => {
        if ((field.field_type = 'number')) {
          const value = Math.floor(Math.random() * 100).toString();
          const id = section.section_label.replaceAll(' ', '') + '_field_' + idx;
          return {
            meta: {
              id: id,
              type: 'number',
            },
            description: field.field_label,
            answer: [[value]],
            validated: true,
            valid: true,
            errorMessage: '',
          };
        }
      }),
    );
  });

  return {
    meta: {
      id: uuid(),
      departmentId: '0',
      submittedDate: 'NA',
      submittedUserId: '0',
    },
    items: items,
  };
}

export function getInvalidData(): JsonReportDescriptor {
  return makeInvalid(getData())
}

function makeInvalid(data) {
  const invalidItems = [...data.items].map((item, idx) => {
    const copy = { ...item };
    if (idx > data.items.length - 5) {
      (copy as ReportItem).valid = false;
      (copy as ReportItem).errorMessage = 'Invalid input';
    }
    return copy;
  });
  const invalidData = { ...data };
  invalidData.items = invalidItems;
  return invalidData;
}

export async function submitData(data: JsonReportDescriptor, delayMillis: number, success: boolean): Promise<JsonReportDescriptor> {
  if(success){
    return sleep(delayMillis).then(() => {
      return {...data};
    });
  }else{
    return sleep(delayMillis).then(() => {
      return Promise.reject({...makeInvalid(data)})
    });
  }
}
