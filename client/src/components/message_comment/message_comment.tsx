import { useEffect, useState } from 'react';
import { UserJson, Comment, emptyMessageComment } from 'constants/interfaces';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { useTranslation } from 'react-i18next';
import initialUserJson from '../message_panel/initialUserJson.json';

interface MessageCommentProps {
  commentJson: Comment;
}

const MessageComment = (props: MessageCommentProps) => {
  const { t: translateText } = useTranslation();
  const [comment, setComment] = useState<Comment>(emptyMessageComment);
  const [author, setAuthor] = useState<UserJson>(initialUserJson as unknown as UserJson);
  const readableDate = new Date(props.commentJson.createdAt).toLocaleString();

  useEffect(() => {
    const retrievedUser = props.commentJson.user as unknown;
    setAuthor(retrievedUser as UserJson);
    setComment(props.commentJson);
  }, [props.commentJson]);

  return (
    <div className="pt-2 pb-2 border-bottom">
      <p className="">
        <small>
          <strong>
            {author.name}
          </strong>
          {" (" + parseEscapedCharacters(author.department.name) + ", "}
          {author.role + ") "}
          {translateText('messageBoardCommentCommentedOn') + " "}
          {readableDate}
        </small>
      </p>
      <p>
        <small>
          {comment.messageComment}
        </small>
      </p>
    </div>
  );
};

export default MessageComment;
