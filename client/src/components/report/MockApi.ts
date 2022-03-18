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
        id: uuid(),
        type: 'label',
      },
      description: section.section_label,
      answer: [],
      validated: true,
      valid: true,
      errorMessage: '',
    });
    const a = section.section_fields.map((field): ReportItem => {
      if ((field.field_type = 'number')) {
        let b = {
          meta: {
            id: uuid(),
            type: 'number',
          },
          description: field.field_label,
          answer: [[Math.floor(Math.random() * 100).toString()]],
          validated: true,
          valid: true,
          errorMessage: '',
        };
        return b;
      }
    });
    console.log(a);

    return fields.concat(a);
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

export async function sendData(data, delay: number) {
    return sleep(delay).then(() => {
        return data
    })
}

export async function sendFaultyData(data, delay: number) {
  // Simmulate data transfer time
  return sleep(delay).then(() => {
    const validatedItems = data.items.map((item) => {
      (item as ReportItem).valid = Math.random() < 0.5;
      (item as ReportItem).errorMessage = 'Invalid input';
      return item;
    });
    const newData = { ...data };
    newData.items = validatedItems;
    return newData;
  });
}
