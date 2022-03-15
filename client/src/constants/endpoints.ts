// Case studies
const ENDPOINT_CASESTUDY_FEATURED: string = '/api/case-studies/featured';

// Employee of the month
const ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET: string = '/api/employee-of-the-month';

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
  ENDPOINT_CASESTUDY_FEATURED,
  ENDPOINT_EMPLOYEE_OF_THE_MONTH_GET,
  ENDPOINT_LEADERBOARD_GET,
  ENDPOINT_MESSAGEBOARD_GET,
  ENDPOINT_MESSAGEBOARD_PUT,
};
