import CaseStudy from '../models/CaseStudies';
import Department from '../models/Leaderboard';
import { DepartmentName } from '../models/Leaderboard'

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
    
    for (let key in DepartmentName) {
        let departmentName = DepartmentName[key];
        var departmentPoints = 0;
        var nCaseStudies = 0;
        // await CaseStudy.find().populate('user').exec(async (err, items) => {
        //     items.forEach(item => {
        //         if (item.user.department === departmentName){
        //             nCaseStudies += 1;
        //             departmentPoints += pointsPerCaseStudy;
        //         }
        //     })
        // })
        const caseStudies = await CaseStudy.find().populate('user');
        caseStudies.forEach(item => {
            if (item.user.department === departmentName){
                nCaseStudies += 1;
                departmentPoints += pointsPerCaseStudy;
            }
        })
        
        // await CaseStudy.countDocuments({ userDepartment: departmentName }, function(err, count) {
        //     nCaseStudies += count;
        //     departmentPoints += count * pointsPerCaseStudy;
        // })
        Department.updateOne({ "name": departmentName }, { $set: { "points": departmentPoints, "nCaseStudies": nCaseStudies } })
            .catch((err) => {console.log(err)});
    }

}