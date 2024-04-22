import { UserClientModel } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_ADMIN_POST,
  ENDPOINT_ADMIN_GET,
  ENDPOINT_ADMIN_DELETE_BY_ID,
  ENDPOINT_ADMIN_ME,
  ENDPOINT_LOGOUT,
  ENDPOINT_ADMIN_GET_BY_ID,
  ENDPOINT_ADMIN_PUT_BY_ID,
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

export const getUserById = async (id: string, history: History): Promise<UserClientModel> => {
  const controller = new AbortController();
  try {
    const user: UserClientModel = await Api.Get(
      ENDPOINT_ADMIN_GET_BY_ID(id),
      ResponseMessage.getMsgFetchUsersFailed(),
      history,
      controller.signal,
    );
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getCurrentUser = async (history: History): Promise<UserClientModel> => {
  const controller = new AbortController();
  try {
    const user: UserClientModel = await Api.Get(
      ENDPOINT_ADMIN_ME,
      ResponseMessage.getMsgFetchUsersFailed(),
      history,
      controller.signal,
    );
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const updateUser = async (
  id: string,
  data: AdminUserFormData,
  onSubmit: () => void,
  history: History,
) => {
  try {
    await Api.Put(
      ENDPOINT_ADMIN_PUT_BY_ID(id),
      data,
      onSubmit,
      history,
      ResponseMessage.getMsgUpdateUserFailed(),
    );
  } catch (error) {
    console.error('Error cannot logout current user:', error);
  }
};

export const logoutUser = async (history: History, onLogout: () => void) => {
  try {
    await Api.Post(
      ENDPOINT_LOGOUT,
      {},
      onLogout,
      history,
      'Logging out failed',
      'Logging out...',
      'Logged out successfully!',
    );
  } catch (error) {
    console.error('Error cannot logout current user:', error);
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
