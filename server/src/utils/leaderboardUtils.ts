import Departments from 'utils/departments';
import { IllegalState } from 'exceptions/systemException';
import CaseStudy from '../models/caseStudies';
import Department from '../models/departments';
import UserModel from 'models/user';

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
  await Department.updateMany({}, { $set: { points: 0, nCaseStudies: 0 } });
  const caseStudies = await CaseStudy.find().lean();
  for (const post of caseStudies) {
    const user = await UserModel.findOne({ _id: post.userId }).lean();
    if (!user) {
      throw new IllegalState(`Case study has non-existing user id ${post.userId}`);
    }
    const postDeptName = Departments.Database.getDeptNameById(user.departmentId);
    await Department.findOneAndUpdate({ name: postDeptName }, { $inc: { points: pointsPerCaseStudy, nCaseStudies: 1 } });
  }
}
