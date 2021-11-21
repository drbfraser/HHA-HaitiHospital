import CaseStudy from '../models/CaseStudies';
import Department from '../models/Leaderboard';
import { DepartmentName } from '../models/Leaderboard'

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
    
    for (let key in DepartmentName) {
        let departmentName = DepartmentName[key];
        let departmentPoints = 0;
        let nCaseStudies = 0;
        await CaseStudy.countDocuments({ userDepartment: departmentName }, function(err, count) {
            nCaseStudies += count;
            departmentPoints += count * pointsPerCaseStudy;
        })
        Department.updateOne({ "name": departmentName }, { $set: { "points": departmentPoints, "nCaseStudies": nCaseStudies } })
            .catch((err) => {console.log(err)});
    }

}