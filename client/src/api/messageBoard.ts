import { MessageJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_MESSAGEBOARD_POST,
  ENDPOINT_MESSAGEBOARD_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_PUT_BY_ID,
  ENDPOINT_MESSAGEBOARD_GET,
  ENDPOINT_MESSAGEBOARD_DELETE_BY_ID,
} from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import { ResponseMessage } from 'utils/response_message';

export const addMessageBoard = async (data: any, onSubmitAction: () => void, history: History) => {
  try {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_POST,
      data,
      onSubmitAction,
      history,
      ResponseMessage.getMsgCreatePostFailed(),
      undefined,
      ResponseMessage.getMsgCreatePostOk(),
    );
  } catch (error) {
    console.error('Error adding message board:', error);
  }
};

export const getMessageBoard = async (id: string, history: History): Promise<MessageJson> => {
  const controller = new AbortController();
  try {
    const messageBoard: MessageJson = await Api.Get(
      ENDPOINT_MESSAGEBOARD_GET_BY_ID(id),
      TOAST_MESSAGEBOARD_GET_ERROR,
      history,
      controller.signal,
    );
    return messageBoard;
  } catch (error) {
    console.error('Error fetching message board:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const getAllMessageBoards = async (history: History): Promise<MessageJson[]> => {
  const controller = new AbortController();
  try {
    const messageBoard: MessageJson[] = await Api.Get(
      ENDPOINT_MESSAGEBOARD_GET,
      TOAST_MESSAGEBOARD_GET_ERROR,
      history,
      controller.signal,
    );
    return messageBoard;
  } catch (error) {
    console.error('Error fetching all message boards:', error);
    throw error;
  } finally {
    controller.abort();
  }
};

export const updateMessageBoard = async (
  id: string,
  data: any,
  submitAction: () => void,
  failedMessage: string,
  successMessage: string,
  history: History,
) => {
  try {
    await Api.Put(
      ENDPOINT_MESSAGEBOARD_PUT_BY_ID(id),
      data,
      submitAction,
      history,
      failedMessage,
      undefined,
      successMessage,
    );
  } catch (error) {
    console.error('Error updating message board', error);
    throw error;
  }
};

export const deleteMessageBoard = async (messageId: string, history: History) => {
  try {
    await Api.Delete(
      ENDPOINT_MESSAGEBOARD_DELETE_BY_ID(messageId),
      {},
      () => {},
      history,
      ResponseMessage.getMsgDeletePostFailed(),
      undefined,
      ResponseMessage.getMsgDeletePostOk(),
    );
  } catch (error) {
    console.error('Error deleting message comment:', error);
  }
};
