import CommentInput from "./comment-input";
import { CommentDetailsType } from "@/types/db";
import useComment from "@/components/comments-list/use-comment";
import Author from "../post-card/author";
import CommentFooter from "./comment-footer";
import CommentContent from "./comment-content";
import DeletedCommenFallback from "./deleted-comment-fallback";

export interface CommentitemProps {
  comment: CommentDetailsType;
}

const CommentItem = ({ comment }: CommentitemProps) => {
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
      <div className="bg-white gap-x-3 py-3 rounded-lg shadow-sm mb-3 dark:bg-primary-dark-200">
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
