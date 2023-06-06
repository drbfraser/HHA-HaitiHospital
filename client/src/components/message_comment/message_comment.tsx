import { Comment, UserDetails, emptyMessageComment } from 'constants/interfaces';
import { useEffect, useState } from 'react';

import initialUserJson from '../message_panel/initialUserJson.json';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { useTranslation } from 'react-i18next';

interface MessageCommentProps {
  commentJson: Comment;
}

const MessageComment = (props: MessageCommentProps) => {
  const { t: translateText } = useTranslation();
  const author = !!props.commentJson.user ? props.commentJson.user : initialUserJson;
  const comment = !!props.commentJson ? props.commentJson : emptyMessageComment;

  console.log('MessageCommentProps: ', props);
  return (
    <div className="pt-2 pb-2 border-bottom">
      <p className="">
        <small>
          <strong>{author.name}</strong>
          {' (' + parseEscapedCharacters(author.department.name) + ', '}
          {author.role + ') '}
          {translateText('messageBoardCommentCommentedOn') + ' '}
          {props.commentJson.createdAt}
        </small>
      </p>
      <p>
        <small>{comment.messageComment}</small>
      </p>
    </div>
  );
};

export default MessageComment;
