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
  FAILED = 'failed',
}

// Make sure enum values match with i18-next translation JSON
enum RequestItem {
  DEPARTMENT = 'department',
  DEPARTMENTS = 'departments',
  IMAGE = 'image',
  REPORT = 'report',
  REPORTS = 'reports',
  USER = 'user',
  USERS = 'users',
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
    item: RequestItem.USER,
  });
};
const getMsgUpdateReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.UPDATE,
    status: RequestStatus.FAILED,
    item: RequestItem.USER,
  });
};
const getMsgFetchReportFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORT,
  });
};
const getMsgFetchReportsFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.REPORTS,
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
const getMsgFetchUsersFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.USERS,
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

export const ResponseMessage = {
  getMsgFetchDepartmentFailed,
  getMsgFetchDepartmentsFailed,

  getMsgFetchImageFailed,

  getMsgCreateReportOk,
  getMsgCreateReportFailed,
  getMsgUpdateReportOk,
  getMsgUpdateReportFailed,
  getMsgFetchReportFailed,
  getMsgFetchReportsFailed,
  getMsgDeleteReportOk,
  getMsgDeleteReportFailed,

  getMsgCreateUserOk,
  getMsgCreateUserFailed,
  getMsgUpdateUserOk,
  getMsgUpdateUserFailed,
  getMsgFetchUsersFailed,
  getMsgFetchUserFailed,
  getMsgDeleteUserOk,
  getMsgDeleteUserFailed,
};
