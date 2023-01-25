import CaseStudyModel, { CaseStudy } from 'models/caseStudies';
import { currYear, currMonth } from 'utils/dateFormatting';
import { LeaderboardJson } from 'models/leaderboard';
import { Department } from 'models/departments';

export const leaderboardPointsCalculator = async (
  pointsFactor: number,
  department: Department,
): Promise<LeaderboardJson> => {
  const numberOfCaseStudies: CaseStudy[] = await CaseStudyModel.find({
    // Checks if the case study is created between YYYY-MM-01T00:00:00 and YYYY-(next month)-01T00:00:00
    createdAt: {
      $gte: new Date(currYear, currMonth, 1),
      $lte: new Date(currYear, currMonth + 1, 1),
    },
    departmentId: department._id!,
  });

  // Eventually will need to add report points to this
  const json: LeaderboardJson = {
    id: department._id!,
    name: department.name,
    points: pointsFactor * numberOfCaseStudies.length,
    nCaseStudies: numberOfCaseStudies.length,
  };
  return json;
};
