import { parseEscapedCharacters } from 'utils/escapeCharacterParser';
import { MessageBoardCommentJson as Comment } from '@hha/common';
import { useTranslation } from 'react-i18next';
import { toI18nDateString } from 'constants/date';

interface MessageCommentProps {
  comment: Comment;
}

const MessageComment = (props: MessageCommentProps) => {
  const author = props.comment.user;
  const comment = props.comment;
  const departmentName = parseEscapedCharacters(author.department.name);
  const { i18n } = useTranslation();

  return (
    <div className="pt-2 pb-2 border-bottom">
      <div className="d-flex justify-content-between">
        <strong>
          {author.name}
          {` (${departmentName}, ${author.role})`}
        </strong>
        <small className="text-muted fs-6">{`${toI18nDateString(props.comment.createdAt, i18n.resolvedLanguage)}`}</small>
      </div>
      <div className="d-flex bg-light m-2 p-2 rounded border border-secondary-subtle">
        {comment.messageComment}
      </div>
    </div>
  );
};

export default MessageComment;
