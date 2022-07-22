// Make sure slug's value matches with its corresponding variable name
const USER_ID_SLUG: string = 'userId';
export type UserIdParams = {
  userId: string;
};
const BIO_REPORT_ID_SLUG: string = 'bioId';
export type BioReportIdParams = {
  bioId: string;
};

// Patterns
const ADMIN_MAIN: string = '/admin';
const ADMIN_ADD_USER: string = `${ADMIN_MAIN}/add-user`;
const ADMIN_EDIT_USER: string = `${ADMIN_MAIN}/edit-user/:${USER_ID_SLUG}`;

const BIOMECH_MAIN: string = '/biomechanic';
const BIOMECH_REPORT: string = `${BIOMECH_MAIN}/report-broken-kit`;
const BIOMECH_VIEW: string = `${BIOMECH_MAIN}/view/:${BIO_REPORT_ID_SLUG}`;

// URL instances
const getAdminEditUser = (userId: string): string => {
  return `${ADMIN_MAIN}/edit-user/${userId}`;
};
const getAdminMain = (): string => {
  return `${ADMIN_MAIN}`;
};
const getAdminAddUser = (): string => {
  return `${ADMIN_ADD_USER}`;
};

const getBioMechMain = (): string => {
  return `${BIOMECH_MAIN}`;
};
const getBioMechReport = (): string => {
  return `${BIOMECH_REPORT}`;
};
const getBioMechViewId = (reportId: string): string => {
  return `${BIOMECH_MAIN}/view/${reportId}`;
};

export const Paths = {
  getAdminMain,
  getAdminAddUser,
  getAdminEditUser,
  getBioMechMain,
  getBioMechReport,
  getBioMechViewId,
};

export const PathPatterns = {
  ADMIN_MAIN,
  ADMIN_ADD_USER,
  ADMIN_EDIT_USER,
  BIOMECH_MAIN,
  BIOMECH_REPORT,
  BIOMECH_VIEW,
};
