// Biomechanical Reports
const ENDPOINT_BIOMECH_GET: string = '/api/biomech';
const ENDPOINT_BIOMECH_GET_BY_ID = (id: string): string => {
  return `${ENDPOINT_BIOMECH_GET}/${id}`;
};
const ENDPOINT_BIOMECH_POST: string = ENDPOINT_BIOMECH_GET;

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

// Employee of the month
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET: string = '/api/employee-of-the-month';
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT: string = ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET;

// Image
const ENDPOINT_IMAGE_BY_PATH = (path: string): string => {
  return `/api/image/${path.split('/')[2]}`;
};

// Leaderboard
const ENDPOINT_LEADERBOARD_GET: string = '/api/leaderboard';

// Messageboard
const ENDPOINT_MESSAGEBOARD_GET = (id: string): string => {
  return `/api/message-board/${id}`;
};
const ENDPOINT_MESSAGEBOARD_PUT = (id: string): string => {
  return ENDPOINT_MESSAGEBOARD_GET(id);
};

export {
  ENDPOINT_BIOMECH_GET,
  ENDPOINT_BIOMECH_GET_BY_ID,
  ENDPOINT_BIOMECH_POST,
  ENDPOINT_CASESTUDY_GET,
  ENDPOINT_CASESTUDY_GET_BY_ID,
  ENDPOINT_CASESTUDY_FEATURED,
  ENDPOINT_CASESTUDY_POST,
  ENDPOINT_CASESTUDY_PATCH_BY_ID,
  ENDPOINT_CASESTUDY_DELETE_BY_ID,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_PUT,
  ENDPOINT_IMAGE_BY_PATH,
  ENDPOINT_LEADERBOARD_GET,
  ENDPOINT_MESSAGEBOARD_GET,
  ENDPOINT_MESSAGEBOARD_PUT,
};
