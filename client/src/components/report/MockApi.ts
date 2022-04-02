import nicuJSON from '../../pages/form/models/nicuModel.json';
import { v4 as uuid } from 'uuid';
import { ReportItem } from './Report';
import { JsonReportDescriptor } from 'common/definitions/json_report';
import { ItemType } from 'common/definitions/json_report';
import { Department } from 'constants/interfaces';
import MockDepartmentApi from 'actions/MockDepartmentApi';

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export async function getDataDelay(millis: number): Promise<JsonReportDescriptor> {
  await sleep(millis);
  return getData();
}

function getData() {
  const date = new Date();
  const items: ReportItem[] = nicuJSON.flatMap((section, idx) => {
    const items: ReportItem[] = [];
    const label = {
      id: 'label' + idx,
      type: 'label',
      description: section.section_label,
      answer: [],
      validated: true,
      valid: true,
      errorMessage: '',
    };

    const itemsFound = section.section_fields
      .map((field, idx): ReportItem => {
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
      departmentId: sampleDepartment.id,
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
) {
  const value = Math.floor(Math.random() * 100).toString();
  const id = section.section_label.replaceAll(' ', '') + '_field_' + idx;
  return {
    id: id,
    type: ItemType.NUMERIC,
    description: field.field_label,
    answer: [[value]],
    validated: true,
    valid: true,
    errorMessage: '',
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
        message: 'Invalid data',
        data: { ...makeInvalid(data) },
      };
      return Promise.reject(errorData);
    });
  }
}
