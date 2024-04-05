import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { MessageBoardCommentJson as Comment } from '@hha/common';

interface MessageCommentProps {
  comment: Comment;
}

const MessageComment = (props: MessageCommentProps) => {
  const author = props.comment.user;
  const comment = props.comment;
  const departmentName = parseEscapedCharacters(author.department.name);

  return (
    <div className="pt-2 pb-2 border-bottom">
      <div className="d-flex justify-content-between">
        <strong>
          {author.name}
          {` (${departmentName}, ${author.role})`}
        </strong>
        <small className="text-muted fs-6">{`${props.comment.createdAt}`}</small>
      </div>
      <div className="d-flex bg-light m-2 p-2 rounded border border-secondary-subtle">
        {comment.messageComment}
      </div>
    </div>
  );
};

export default MessageComment;
