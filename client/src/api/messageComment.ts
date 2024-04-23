import { MessageBoardCommentJson } from '@hha/common';
import Api from 'actions/Api';
import {
  ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID,
  ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
} from 'constants/endpoints';
import { TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR } from 'constants/toastErrorMessages';
import { History } from 'history';
import { ResponseMessage } from 'utils';

export const addMessageComment = async (
  data: any,
  actionCallback: (comment: MessageBoardCommentJson) => void,
  history: History,
) => {
  try {
    await Api.Post(
      ENDPOINT_MESSAGEBOARD_COMMENTS_POST,
      data,
      actionCallback,
      history,
      ResponseMessage.getMsgCreateCommentFailed(),
      undefined,
      ResponseMessage.getMsgCreateCommentOk(),
    );
  } catch (error) {
    console.error('Error adding message comment', error);
  }
};

export const getMessageComments = async (
  messageBoardId: string,
  history: History,
): Promise<MessageBoardCommentJson[]> => {
  const controller = new AbortController();
  try {
    const comments: MessageBoardCommentJson[] = await Api.Get(
      ENDPOINT_MESSAGEBOARD_COMMENTS_GET_BY_ID(messageBoardId),
      TOAST_MESSAGEBOARD_COMMENTS_GET_ERROR,
      history,
      controller.signal,
    );
    return comments;
  } catch (error) {
    console.error('Error fetching message comment', error);
    throw error;
  } finally {
    controller.abort();
  }
};
