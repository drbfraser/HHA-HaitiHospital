import i18n from 'i18n';
const { t } = i18n;

// Make sure enum values match with i18-next translation JSON
enum RequestAction {
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
  USER = 'user',
  USERS = 'users',
  DEPARTMENT = 'department',
  DEPARTMENTS = 'departments',
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


const getMsgFetchDepartmentsFailed = (): string => {
  return getResponseMessage({
    action: RequestAction.FETCH,
    status: RequestStatus.FAILED,
    item: RequestItem.DEPARTMENTS,
  });
};

export const ResponseMessage = {
  getMsgFetchUsersFailed,
  getMsgFetchUserFailed,
  getMsgUpdateUserOk,
  getMsgUpdateUserFailed,
  getMsgDeleteUserOk,
  getMsgDeleteUserFailed,
  getMsgFetchDepartmentsFailed
};
