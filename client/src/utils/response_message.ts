import i18n from 'i18n';
const { t } = i18n;

// Make sure enum values match with i18-next translation JSON
enum RequestAction {
  CREATE = 'create',
  UPDATE = 'update',
  FETCH = 'fetch',
  DELETE = 'delete',
}

// Make sure enum values match with i18-next translation JSON
enum RequestStatus {
  OK = 'ok',
  PENDING = 'pending',
  FAILED = 'failed',
}

// Make sure enum values match with i18-next translation JSON
enum RequestItem {
  DEPARTMENT = 'department',
  DEPARTMENTS = 'departments',
  IMAGE = 'image',
  REPORT = 'report',
  REPORTS = 'reports',
  REPORT_TEMPLATE = 'report_template',
  USER = 'user',
  USERS = 'users',
  CASE_STUDY = 'case study',
  POST = 'message board post',
  COMMENT = 'message board comment',
}

// Make sure these keys match with i18-next translation JSON
const ITEM_KEY: string = 'item';
const ACTION_KEY: string = 'request_action';
const RESPONSE_KEY: string = 'request_response';

type ResponseOptions = {
  action: RequestAction;
  status: RequestStatus;
  item: RequestItem;
};

const getResponseMessage: (options: ResponseOptions) => string = (options) => {
  const item = t(`${ITEM_KEY}.${options.item}`);
  const action = t(`${ACTION_KEY}.${options.action}`);
  const msg = t(`${RESPONSE_KEY}.${options.status}`, {
    action: action,
    item: item,
  });
  return msg;
};

// DEPARTMENT
const getMsgFetchDepartmentFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.DEPARTMENT,
  });
};
const getMsgFetchDepartmentsFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.DEPARTMENTS,
  });
};

// IMAGE
const getMsgFetchImageFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.IMAGE,
  });
};

// REPORT
const getMsgCreateReportOk = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.OK,
    item: RequestItem.REPORT,
  });
};
const getMsgCreateReportPending = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.PENDING,
    item: RequestItem.REPORT,
  });
};
const getMsgCreateReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT,
  });
};
const getMsgUpdateReportOk = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.OK,
    item: RequestItem.REPORT,
  });
};
const getMsgUpdateReportPending = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.PENDING,
    item: RequestItem.REPORT,
  });
};
const getMsgUpdateReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT,
  });
};
const getMsgFetchReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT,
  });
};
const getMsgDeleteReportOk = (): string => {
  return getResponseMessage({
    action: RequestAction.DELETE,
    status: RequestStatus.OK,
    item: RequestItem.REPORT,
  });
};
const getMsgDeleteReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.DELETE,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT,
  });
};

// REPORTS
const getMsgFetchReportsFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORTS,
  });
};

// REPORT_TEMPLATE
const getMsgUpdateReportTemplateOk = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.OK,
    item: RequestItem.REPORT_TEMPLATE,
  });
};
const getMsgUpdateReportTemplatePending = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.PENDING,
    item: RequestItem.REPORT_TEMPLATE,
  });
};
const getMsgUpdateReportTemplateFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT_TEMPLATE,
  });
};

// USER
const getMsgCreateUserOk = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.OK,
    item: RequestItem.USER,
  });
};
const getMsgCreateUserFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.FAILED,
    item: RequestItem.USER,
  });
};
const getMsgUpdateUserOk = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.OK,
    item: RequestItem.USER,
  });
};
const getMsgUpdateUserFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.FAILED,
    item: RequestItem.USER,
  });
};
const getMsgFetchUserFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.USER,
  });
};
const getMsgDeleteUserOk = (): string => {
  return getResponseMessage({
    action: RequestAction.DELETE,
    status: RequestStatus.OK,
    item: RequestItem.USER,
  });
};
const getMsgDeleteUserFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.DELETE,
    status: RequestStatus.FAILED,
    item: RequestItem.USER,
  });
};

// USERS
const getMsgFetchUsersFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.USERS,
  });
};

// CASE STUDIES
const getMsgCreateCaseStudyFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.FAILED,
    item: RequestItem.CASE_STUDY,
  });
};

const getMsgCreateCaseStudyOk = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.OK,
    item: RequestItem.CASE_STUDY,
  });
};

// MESSAGE BOARD
const getMsgCreatePostFailed = () => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.FAILED,
    item: RequestItem.POST,
  });
};

const getMsgCreatePostOk = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.OK,
    item: RequestItem.POST,
  });
};

const getMsgCreateCommentFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.FAILED,
    item: RequestItem.COMMENT,
  });
};

const getMsgCreateCommentOk = (): string => {
  return getResponseMessage({
    action: RequestAction.CREATE,
    status: RequestStatus.OK,
    item: RequestItem.COMMENT,
  });
};
export const ResponseMessage = {
  getMsgFetchDepartmentFailed,
  getMsgFetchDepartmentsFailed,

  getMsgFetchImageFailed,

  getMsgCreateReportOk,
  getMsgCreateReportPending,
  getMsgCreateReportFailed,
  getMsgUpdateReportOk,
  getMsgUpdateReportPending,
  getMsgUpdateReportFailed,
  getMsgFetchReportFailed,
  getMsgDeleteReportOk,
  getMsgDeleteReportFailed,

  getMsgFetchReportsFailed,

  getMsgUpdateReportTemplateOk,
  getMsgUpdateReportTemplatePending,
  getMsgUpdateReportTemplateFailed,

  getMsgCreateUserOk,
  getMsgCreateUserFailed,
  getMsgUpdateUserOk,
  getMsgUpdateUserFailed,
  getMsgFetchUserFailed,
  getMsgDeleteUserOk,
  getMsgDeleteUserFailed,

  getMsgFetchUsersFailed,

  getMsgCreateCaseStudyFailed,
  getMsgCreateCaseStudyOk,

  getMsgCreatePostFailed,
  getMsgCreatePostOk,
  getMsgCreateCommentFailed,
  getMsgCreateCommentOk,
};
