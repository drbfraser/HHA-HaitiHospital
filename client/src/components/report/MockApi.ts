import nicuJSON from '../../pages/form/models/nicuModel.json';
import data from './newNicuData.json'
import { v4 as uuid } from 'uuid';
import { ReportItem } from './Report';
import { JsonReportDescriptor, JsonReportItem } from 'common/json_report';
import { ItemType } from 'common/json_report';
import { Department } from 'constants/interfaces';
import MockDepartmentApi from 'actions/MockDepartmentApi';

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export async function getDataDelay(millis: number, success: boolean): Promise<JsonReportDescriptor> {
  await sleep(millis)
  if(success)
    return getData();
  else 
    throw {code:'500', message:'Internal server error'}
}

function getData(): JsonReportDescriptor {
  console.log(data);
  return data
}

function getData2() {
  const date = new Date();
  const items: JsonReportItem[] = nicuJSON.flatMap((section, idx) => {
    const items: JsonReportItem[] = [];
    const label: JsonReportItem = {
      type: 'label',
      description: section.section_label,
      answer: [],
    };

    const itemsFound = section.section_fields
      .map((field, idx): JsonReportItem => {
        if ((field.field_type = 'number')) {
          return makeNumericItem(section, idx, field);
        }
      })
      .filter((item) => item !== undefined);
    items.push(label);
    return items.concat(itemsFound);
  });

  // Temporary switch to MockDepartmentApi for now
  const nicuId: number = 2;
  const sampleDepartment: Department = MockDepartmentApi.getDepartmentById(
    nicuId.toString(),
  ) as Department;

  return {
    meta: {
      id: uuid(),
      department: sampleDepartment,
      submittedDate: date.toLocaleDateString(),
      submittedUserId: '0',
    },
    items: items,
  };
}

function makeNumericItem(
  section: {
    section_label: string;
    section_fields: (
      | {
          field_id: string;
          field_label: string;
          field_type: string;
          field_value: number;
          field_level: number;
          subsection_label?: undefined;
        }
      | {
          subsection_label: string;
          field_id: string;
          field_label: string;
          field_type: string;
          field_value: number;
          field_level: number;
        }
      | {
          field_id: string;
          field_label: string;
          field_type: string;
          field_level: number;
          field_value?: undefined;
          subsection_label?: undefined;
        }
    )[];
  },
  idx: number,
  field:
    | {
        field_id: string;
        field_label: string;
        field_type: string;
        field_value: number;
        field_level: number;
        subsection_label?: undefined;
      }
    | {
        subsection_label: string;
        field_id: string;
        field_label: string;
        field_type: string;
        field_value: number;
        field_level: number;
      }
    | {
        field_id: string;
        field_label: string;
        field_type: string;
        field_level: number;
        field_value?: undefined;
        subsection_label?: undefined;
      },
): JsonReportItem {
  const value = Math.floor(Math.random() * 100).toString();
  return {
    type: ItemType.NUMERIC,
    description: field.field_label,
    answer: [[value]],
  };
}

export function getInvalidData(): JsonReportDescriptor {
  return makeInvalid(getData());
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

export async function submitData(
  data: JsonReportDescriptor,
  delayMillis: number,
  success: boolean,
): Promise<JsonReportDescriptor> {
  if (success) {
    return sleep(delayMillis).then(() => {
      return { ...data };
    });
  } else {
    return sleep(delayMillis).then(() => {
      const errorData = {
        code: 400,
        message: 'Invalid data',
        data: { ...makeInvalid(data) },
      };
      return Promise.reject(errorData);
    });
  }
}
