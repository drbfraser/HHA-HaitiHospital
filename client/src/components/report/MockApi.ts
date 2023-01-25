import data from './newNicuData.json';
import { JsonReportDescriptor } from '@hha/common';

const sleep = (milliseconds: number) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

export async function getDataDelay(
  millis: number,
  success: boolean,
): Promise<JsonReportDescriptor> {
  await sleep(millis);
  if (success) return getData();
  else throw new Error('Internal server error');
}

function getData(): JsonReportDescriptor {
  console.log(data);
  return data;
}

export async function submitData(
  data: JsonReportDescriptor,
  delayMillis: number,
  success: boolean,
): Promise<JsonReportDescriptor> {
  return await sleep(delayMillis).then(() => {
    return success
      ? Promise.resolve({ ...data })
      : Promise.reject({ code: '400', message: 'Intentional failure.' });
  });
}
