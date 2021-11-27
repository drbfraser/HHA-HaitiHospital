import CaseStudy from '../models/CaseStudies';
import Department, { DepartmentName } from '../models/Leaderboard';

const pointsPerCaseStudy = 10;

export async function updateDepartmentPoints() {
    try {
        const caseStudies = await CaseStudy.find().populate('user');
        const departmentPointsMap = new Map();
        const nCaseStudiesMap = new Map();
        
        await caseStudies.forEach(async (item) => {
            for (let key in DepartmentName) {
                let departmentName = DepartmentName[key];
                if (item.user.department === departmentName){
                    let departmentPoints = departmentPointsMap.get(departmentName);
                    if (departmentPoints) {
                        departmentPoints += pointsPerCaseStudy;
                    } else {
                        departmentPoints = pointsPerCaseStudy;
                    }
                    departmentPointsMap.set(departmentName, departmentPoints);
                    let nCaseStudies = nCaseStudiesMap.get(departmentName);
                    if (nCaseStudies){
                        nCaseStudies += 1;
                    } else {
                        nCaseStudies = 1;
                    }
                    nCaseStudiesMap.set(departmentName, nCaseStudies);
                }
            }
        })
        for (let key in DepartmentName){
            await Department.updateOne({ "name": DepartmentName[key] }, { $set: { "points": departmentPointsMap.get(DepartmentName[key]), "nCaseStudies": nCaseStudiesMap.get(DepartmentName[key]) } })
        }
        
    } catch (err) {
        console.log(err);
    }
}