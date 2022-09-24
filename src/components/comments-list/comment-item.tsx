import { CommentDetailsType } from '@/types/db';
import useComment from '@/components/comments-list/use-comment';
import CommentInput from './comment-input';
import Author from '../post-card/author';
import CommentFooter from './comment-footer';
import CommentContent from './comment-content';
import DeletedCommenFallback from './deleted-comment-fallback';

export interface CommentitemProps {
  comment: CommentDetailsType;
  parentUserName: string | null;
}

const CommentItem = ({ comment, parentUserName }: CommentitemProps) => {
  const {
    onChangeDraftContent,
    handleAddCommentReply,
    handleUpdateComment,
    isReplying,
    toggleIsEditing,
    toggleIsReplying,
    draftContent,
    isEditing,
  } = useComment({ comment });

  if (comment.isDeleted) {
    return <DeletedCommenFallback />;
  }

  return (
    <>
      <div
        className="bg-blue-50/50 gap-x-3 p-2 rounded-lg mb-3 dark:bg-primary-dark-100"
        id={`comment-${comment.id}`}
      >
        <Author
          authorId={comment.userId}
          authorImage={comment.user.image}
          authorName={comment.user.name}
          postCreatedAt={comment.createdAt}
        />
        <CommentContent
          commentMessage={comment.message}
          draftContent={draftContent}
          handleUpdateComment={handleUpdateComment}
          isEditing={isEditing}
          onChangeDraftContent={onChangeDraftContent}
          parentUserName={parentUserName}
        />
        <CommentFooter
          comment={comment}
          toggleIsEditing={toggleIsEditing}
          toggleIsReplying={toggleIsReplying}
        />
      </div>

      {isReplying && <CommentInput onMessageSubmit={handleAddCommentReply} />}
    </>
  );
};

export default CommentItem;
