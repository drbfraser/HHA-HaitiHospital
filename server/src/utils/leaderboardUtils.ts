import CaseStudy from '../models/caseStudies.model';
import Department from '../models/leaderboard.model';
import { DepartmentName } from '../models/departments.model';

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
