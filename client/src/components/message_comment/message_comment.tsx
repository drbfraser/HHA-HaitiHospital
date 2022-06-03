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
    <div className="d-flex pt-2">
      {/* Comment content */}
      <div className="pb-3 mb-0 border-bottom flex-grow-1">
        {/* Comment info */}
        <p className="">
          <small>
            <strong>
              {author.name}
            </strong>
            {" (" + parseEscapedCharacters(author.department.name) + ", "}
            {author.role + ") "}
            {translateText('messageBoardCommentPostedOn') + " "}
            {readableDate}
          </small>
        </p>
        <p>
          <small>
            {comment.messageComment}
          </small>
        </p>
      </div>
    </div>
  );
};

export default MessageComment;
