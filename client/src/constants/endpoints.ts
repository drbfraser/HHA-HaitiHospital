// Authentication
const ENDPOINT_LOGIN: string = 'api/auth/login';
const ENDPOINT_LOGOUT: string = 'api/auth/logout';

// Admin
const ENDPOINT_ADMIN_GET: string = '/api/users';
const ENDPOINT_ADMIN_GET_BY_ID = (id: string) => {
  return `${ENDPOINT_ADMIN_GET}/${id}`;
};
const ENDPOINT_ADMIN_ME: string = `${ENDPOINT_ADMIN_GET}/me`;
const ENDPOINT_ADMIN_POST: string = ENDPOINT_ADMIN_GET;
const ENDPOINT_ADMIN_PUT_BY_ID = (id: string) => {
  return ENDPOINT_ADMIN_GET_BY_ID(id);
};
const ENDPOINT_ADMIN_DELETE_BY_ID = (id: string): string => {
  return ENDPOINT_ADMIN_GET_BY_ID(id);
};

// Biomechanical Reports
const ENDPOINT_BIOMECH_GET: string = '/api/biomech';
const ENDPOINT_BIOMECH_GET_BY_ID = (id: string): string => {
  return `${ENDPOINT_BIOMECH_GET}/${id}`;
};
const ENDPOINT_BIOMECH_UPDATE_BY_ID = (id: string): string => {
  return `${ENDPOINT_BIOMECH_GET}/${id}`;
};
const ENDPOINT_BIOMECH_POST: string = ENDPOINT_BIOMECH_GET;
const ENDPOINT_BIOMECH_DELETE_BY_ID = (id: string): string => {
  return ENDPOINT_BIOMECH_GET_BY_ID(id);
};

// Case studies
const ENDPOINT_CASESTUDY_GET: string = '/api/case-studies';
const ENDPOINT_CASESTUDY_GET_BY_ID = (id: string): string => {
  return `${ENDPOINT_CASESTUDY_GET}/${id}`;
};
const ENDPOINT_CASESTUDY_FEATURED: string = `${ENDPOINT_CASESTUDY_GET}/featured`;
const ENDPOINT_CASESTUDY_POST: string = ENDPOINT_CASESTUDY_GET;
const ENDPOINT_CASESTUDY_PATCH_BY_ID = (id: string): string => {
  return ENDPOINT_CASESTUDY_GET_BY_ID(id);
};
const ENDPOINT_CASESTUDY_DELETE_BY_ID = (id: string): string => {
  return ENDPOINT_CASESTUDY_GET_BY_ID(id);
};

// Departments
const ENDPOINT_DEPARTMENTS_GET: string = '/api/department';
const ENDPOINT_DEPARTMENT_GET_BY_ID = (id: string): string => {
  return `${ENDPOINT_DEPARTMENTS_GET}/${id}`;
};

// Employee of the month
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET: string = '/api/employee-of-the-month';
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT: string = ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET;
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST: string = ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET;
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID = (id: string): string => {
  return `${ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET}/${id}`;
};

// Image
const ENDPOINT_IMAGE_BY_PATH = (path: string): string => {
  return `/api/image/${path.split('/')[2]}`;
};

// Leaderboard
const ENDPOINT_LEADERBOARD_GET: string = '/api/leaderboard';

// Messageboard
const ENDPOINT_MESSAGEBOARD_GET: string = '/api/message-board';
const ENDPOINT_MESSAGEBOARD_GET_BY_ID = (id: string): string => {
  return `${ENDPOINT_MESSAGEBOARD_GET}/${id}`;
};
const ENDPOINT_MESSAGEBOARD_POST: string = ENDPOINT_MESSAGEBOARD_GET;
const ENDPOINT_MESSAGEBOARD_PUT_BY_ID = (id: string): string => {
  return ENDPOINT_MESSAGEBOARD_GET_BY_ID(id);
};
const ENDPOINT_MESSAGEBOARD_DELETE_BY_ID = (id: string): string => {
  return ENDPOINT_MESSAGEBOARD_GET_BY_ID(id);
};
const ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID = (id: string) => {
  return `/api/message-board/comments/${id}`;
};
const ENDPOINT_MESSAGEBOARD_COMMENTS_POST: string = '/api/message-board/comments';

// Reports
const ENDPOINT_REPORTS: string = '/api/report';
const ENDPOINT_REPORTS_GET_BY_DEPARTMENT = (id: string) => `/api/report/department/${id}`;
const ENDPOINT_REPORT_GET_BY_ID = (id: string) => `/api/report/${id}`;
const ENDPOINT_REPORT_DELETE_BY_ID = (id: string) => `/api/report/${id}`;

// template
const ENDPOINT_TEMPLATE: string = '/api/template';

export {
  ENDPOINT_ADMIN_DELETE_BY_ID,
  ENDPOINT_ADMIN_GET,
  ENDPOINT_ADMIN_GET_BY_ID,
  ENDPOINT_ADMIN_ME,
  ENDPOINT_ADMIN_POST,
  ENDPOINT_ADMIN_PUT_BY_ID,
  ENDPOINT_BIOMECH_DELETE_BY_ID,
  ENDPOINT_BIOMECH_GET,
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_BIOMECH_POST,
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_CASESTUDY_FEATURED,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_GET_BY_ID,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
  ENDPOINT_CASESTUDY_POST,
  ENDPOINT_DEPARTMENTS_GET,
  ENDPOINT_DEPARTMENT_GET_BY_ID,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_POST,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_DELETE_BY_ID,
  ENDPOINT_IMAGE_BY_PATH,
  ENDPOINT_LEADERBOARD_GET,
  ENDPOINT_LOGIN,
  ENDPOINT_LOGOUT,
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
  ENDPOINT_MESSAGEBOARD_DELETE_BY_ID,
  ENDPOINT_MESSAGEBOARD_GET,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_POST,
  ENDPOINT_MESSAGEBOARD_PUT_BY_ID,
  ENDPOINT_REPORTS,
  ENDPOINT_REPORTS_GET_BY_DEPARTMENT,
  ENDPOINT_REPORT_GET_BY_ID,
  ENDPOINT_REPORT_DELETE_BY_ID,
  ENDPOINT_TEMPLATE,
  ENDPOINT_BIOMECH_UPDATE_BY_ID,
};
