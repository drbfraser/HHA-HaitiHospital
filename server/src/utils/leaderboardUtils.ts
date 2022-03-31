import { getDeptNameFromId } from 'common/definitions/departments';
import { SystemException } from 'exceptions/systemException';
import CaseStudy from '../models/caseStudies';
import Department from '../models/departments';

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
  try {
    var caseStudies;
    await Promise.all([
      (async () => {
        await Department.updateMany({}, { $set: { points: 0, nCaseStudies: 0 } });
      })(),
      (async () => {
        caseStudies = await CaseStudy.find().populate('user').lean();
      })()
    ]);
    caseStudies.forEach(async (item) => {
      await Department.findOneAndUpdate({ name: getDeptNameFromId(item.user.department) }, { $inc: { points: pointsPerCaseStudy, nCaseStudies: 1 } });
    });
  } catch (err) {
    console.log(err);
    throw new SystemException(err);
  }
}
