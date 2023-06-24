import { Comment, emptyMessageComment } from 'constants/interfaces';

import initialUserJson from '../message_panel/initialUserJson.json';
import { parseEscapedCharacters } from 'utils/escapeCharacterParser';

interface MessageCommentProps {
  commentJson: Comment;
}

const MessageComment = (props: MessageCommentProps) => {
  const author = !!props.commentJson.user ? props.commentJson.user : initialUserJson;
  const comment = !!props.commentJson ? props.commentJson : emptyMessageComment;
  const departmentName = parseEscapedCharacters(author.department.name);

  return (
    <div className="pt-2 pb-2 border-bottom">
      <div className="d-flex justify-content-between">
        <strong>
          {author.name}
          {` (${departmentName}, ${author.role})`}
        </strong>
        <small className="text-muted fs-6">{`${props.commentJson.createdAt}`}</small>
      </div>
      <div className="d-flex bg-light m-2 p-2 rounded border border-secondary-subtle">
        {comment.messageComment}
      </div>
    </div>
  );
};

export default MessageComment;
