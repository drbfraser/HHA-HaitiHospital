import { getDeptNameFromId } from 'utils/departments';
import { IllegalState, SystemException } from 'exceptions/systemException';
import CaseStudy from '../models/caseStudies';
import Department from '../models/departments';
import UserModel from 'models/user';

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
    await Department.updateMany({}, { $set: { points: 0, nCaseStudies: 0 } });
    var caseStudies = await CaseStudy.find().lean();
    for (const post of caseStudies) {
        const user = await UserModel.findOne({_id: post.userId}).lean();
        if (!user) {
            throw new IllegalState(`Case study has non-existing user id ${post.userId}`);
        }
        const postDeptName = getDeptNameFromId(user.departmentId);
        await Department.findOneAndUpdate({ name: postDeptName }, { $inc: { points: pointsPerCaseStudy, nCaseStudies: 1} });
    }
}
