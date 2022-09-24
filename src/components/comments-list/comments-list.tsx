import clsx from 'clsx';
import React from 'react';
import { CommentDetailsType } from '@/types/db';
import CommentItem from './comment-item';

const groupCommentsByParentId = (
  comments: CommentDetailsType[]
): Map<string | null, CommentDetailsType[]> => {
  const groups = new Map<string | null, CommentDetailsType[]>();

  comments.forEach((comment) => {
    if (groups.has(comment.parentId)) {
      const commentsByParentId = groups.get(comment.parentId);

      if (commentsByParentId) {
        groups.set(comment.parentId, [...commentsByParentId, comment]);
      }
    } else {
      groups.set(comment.parentId, [comment]);
    }
  });
  return groups;
};

interface CommentsListProps {
  comments: CommentDetailsType[];
  parentId?: string | null;
  parentUserName?: string | null;
  depth?: number;
}

const CommentsList = ({
  comments,
  parentId = null,
  parentUserName = null,
  depth = 0,
}: CommentsListProps) => {
  const commentsByParentId = groupCommentsByParentId(comments);
  const commentsWithCurrentDepth = commentsByParentId.get(parentId);

  if (!commentsWithCurrentDepth) return null;

  return (
    <div
      className={clsx([
        'w-full ',
        depth !== 0 &&
          'pl-5 md:pl-10 border-l-2 border-l-neutral-300 dark:border-l-primary-dark-300',
        depth > 3 && '!pl-0 border-l-0',
      ])}
    >
      {commentsWithCurrentDepth.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} parentUserName={parentUserName} />
          <CommentsList
            comments={comments}
            parentId={comment.id}
            parentUserName={comment.user.name}
            depth={depth + 1}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
