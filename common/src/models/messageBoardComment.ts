import { UserJson } from './user';

export interface MessageBoardComment {
  userId: string;
  parentMessageId: string;
  messageComment: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface MessageBoardCommentJson {
  id: string;
  user: UserJson;
  parentMessageId: string;
  messageComment: string;
  createdAt: string;
  updatedAt: string;
}
