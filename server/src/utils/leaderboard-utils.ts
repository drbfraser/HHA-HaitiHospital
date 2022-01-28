import CaseStudy from '../models/CaseStudies';
import Department from '../models/Leaderboard';
import { DepartmentName } from '../models/Departments';

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
