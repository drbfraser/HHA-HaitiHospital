import { NotFound } from 'exceptions/httpException';
import { ITemplate, TemplateCollection } from 'models/template';

export const getDepartmentsByTemplate = async (departmentIds: string[]) => {
  // assume that a department has at max 1 template

  const templates: ITemplate[] = await TemplateCollection.find({
    departmentId: { $in: departmentIds },
  }).lean();

  // department ids may be duplicate
  // this ensures that comparing the result's length from the mongodb query is sufficient to determine if all ids are valid

  if (new Set(departmentIds).size !== templates.length) {
    throw new NotFound(`There exist a department that has no template`);
  }

  return templates;
};
