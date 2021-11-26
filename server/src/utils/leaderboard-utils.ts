import CaseStudy from '../models/CaseStudies';
import Department, { DepartmentName } from '../models/Leaderboard';

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
    try {
        for (let key in DepartmentName) {
            let departmentName = DepartmentName[key];
            var departmentPoints = 0;
            var nCaseStudies = 0;

            const caseStudies = await CaseStudy.find().populate('user');
            await caseStudies.forEach(item => {
                if (item.user.department === departmentName){
                    nCaseStudies += 1;
                    departmentPoints += pointsPerCaseStudy;
                }
            })

            await Department.updateOne({ "name": departmentName }, { $set: { "points": departmentPoints, "nCaseStudies": nCaseStudies } })
        }
    } catch (err) {
        console.log(err);
    }
}