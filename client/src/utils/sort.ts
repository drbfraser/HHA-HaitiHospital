import { CaseStudyCol, CaseStudySortOrder } from 'pages/case_study/CaseStudyList';

// TODO: Create a "CaseStudy" type (instead of using "any")
export const sortCaseStudies = (prevCaseStudy, nextCaseStudy, sortOrder: CaseStudySortOrder) => {
  if (prevCaseStudy.featured) {
    return Number.NEGATIVE_INFINITY;
  } else if (sortOrder.column === CaseStudyCol.AUTHOR) {
    return sortOrder.isAscDir
      ? prevCaseStudy.user.name.localeCompare(nextCaseStudy.user.name)
      : nextCaseStudy.user.name.localeCompare(prevCaseStudy.user.name);
  } else if (sortOrder.column === CaseStudyCol.CREATED_AT) {
    const prevCreatedAt = new Date(prevCaseStudy.createdAt.split(' ').slice(0, 3).join(' '));
    const prevCreatedAtUTC = new Date(
      Date.UTC(prevCreatedAt.getFullYear(), prevCreatedAt.getMonth(), prevCreatedAt.getDate()),
    );
    const nextCreatedAt = new Date(nextCaseStudy.createdAt.split(' ').slice(0, 3).join(' '));
    const nextCreatedAtUTC = new Date(
      Date.UTC(nextCreatedAt.getFullYear(), nextCreatedAt.getMonth(), nextCreatedAt.getDate()),
    );

    return sortOrder.isAscDir
      ? prevCreatedAtUTC.getTime() - nextCreatedAtUTC.getTime()
      : nextCreatedAtUTC.getTime() - prevCreatedAtUTC.getTime();
  } else if (sortOrder.column === CaseStudyCol.TYPE) {
    return sortOrder.isAscDir
      ? prevCaseStudy.caseStudyType.localeCompare(nextCaseStudy.caseStudyType)
      : nextCaseStudy.caseStudyType.localeCompare(prevCaseStudy.caseStudyType);
  }
  return 0;
};

export type SortOrder<T> = {
  column: T;
  isAscDir: boolean;
};
