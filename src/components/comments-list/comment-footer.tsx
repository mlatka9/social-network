import clsx from 'clsx';
import { useSession } from 'next-auth/react';
import {
  useDeleteCommentMutation,
  useToggleCommentLikeMutation,
} from 'src/hooks/mutation';
import { CommentDetailsType } from '@/types/db';
import HeartIcon from '../common/icons/heart';
import HeartEmptyIcon from '../common/icons/heart-empty';
import CommentIcon from '../common/icons/comment';

interface CommentFooterProps {
  comment: CommentDetailsType;
  toggleIsEditing: () => void;
  toggleIsReplying: () => void;
}
const CommentFooter = ({
  comment,
  toggleIsEditing,
  toggleIsReplying,
}: CommentFooterProps) => {
  const { data: session } = useSession();
  const me = session?.user!;

  const toggleLike = useToggleCommentLikeMutation(comment.postId);

  const handleToggleLike = () => {
    toggleLike({ commentId: comment.id });
  };

  const deleteComment = useDeleteCommentMutation(comment.postId);
  const handleDeleteComment = () => {
    deleteComment({ commentId: comment.id });
  };

  return (
    <div className="flex ml-3 md:ml-14 mr-3">
      <button
        type="button"
        className={clsx([
          'flex items-center cursor-pointer w-fit',
          comment.likedByMe && 'text-red-500',
        ])}
        onClick={handleToggleLike}
      >
        {comment.likedByMe ? (
          <HeartIcon width={16} height={16} />
        ) : (
          <HeartEmptyIcon width={16} height={16} />
        )}
        <p className="ml-2">{comment.likeCount}</p>
      </button>
      <div className="flex items-center w-fit ml-3">
        <CommentIcon width={16} height={16} />
        <p className="ml-2">{comment.repliesCount}</p>
      </div>
      <button
        type="button"
        onClick={toggleIsReplying}
        className="ml-auto font-medium text-xs text-gray-400 hover:text-neutral-800 dark:hover:text-primary-dark-600 transition-colors"
      >
        Reply
      </button>
      {comment.userId === me.id && (
        <>
          <button
            type="button"
            onClick={toggleIsEditing}
            className="ml-3 font-medium text-xs text-gray-400 hover:text-neutral-800 dark:hover:text-primary-dark-600 transition-colors"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={handleDeleteComment}
            className="ml-3 font-medium text-xs text-red-400 hover:text-red-500 dark:hover:text-red-300 transition-colors"
          >
            Delete
          </button>
        </>
      )}
    </div>
  );
};

export default CommentFooter;
