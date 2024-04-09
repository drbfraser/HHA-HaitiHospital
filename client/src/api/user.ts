import { UserClientModel } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_ADMIN_POST,
  ENDPOINT_ADMIN_GET,
  ENDPOINT_ADMIN_DELETE_BY_ID,
} from 'constants/endpoints';
import { History } from 'history';
import { AdminUserFormData } from 'pages/admin/typing';
import { ResponseMessage } from 'utils/response_message';

export const addUser = async (data: AdminUserFormData, onSubmit: () => void, history: History) => {
  try {
    await Api.Post(
      ENDPOINT_ADMIN_POST,
      data,
      onSubmit,
      history,
      ResponseMessage.getMsgCreateUserFailed(),
      undefined,
      ResponseMessage.getMsgCreateUserOk(),
    );
  } catch (error) {
    console.error('Error adding admin:', error);
  }
};

export const getAllUsers = async (history: History): Promise<UserClientModel[]> => {
  const controller = new AbortController();
  try {
    const users: UserClientModel[] = await Api.Get(
      ENDPOINT_ADMIN_GET,
      ResponseMessage.getMsgFetchUsersFailed(),
      history,
      controller.signal,
    );
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const deleteUser = async (id: string, deleteUserActions: () => void, history: History) => {
  try {
    await Api.Delete(
      ENDPOINT_ADMIN_DELETE_BY_ID(id),
      {},
      deleteUserActions,
      history,
      ResponseMessage.getMsgDeleteUserFailed(),
      undefined,
      ResponseMessage.getMsgDeleteUserOk(),
    );
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};
