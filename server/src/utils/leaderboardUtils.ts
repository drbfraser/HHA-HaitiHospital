import CaseStudy from '../models/caseStudies';
import Department from '../models/leaderboard';
import { DepartmentName } from "../common/definitions/departments";

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
  try {
    var caseStudies;
    await Promise.all([
      (async () => {
        await Department.updateMany({}, { $set: { points: 0, nCaseStudies: 0 } });
      })(),
      (async () => {
        caseStudies = await CaseStudy.find().populate('user');
      })()
    ]);
    caseStudies.forEach(async (item) => {
      await Department.findOneAndUpdate({ name: item.user.department }, { $inc: { points: pointsPerCaseStudy, nCaseStudies: 1 } }).exec();
    });
  } catch (err) {
    console.log(err);
  }
}
