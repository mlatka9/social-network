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
  depth?: number;
}

const CommentsList = ({
  comments,
  parentId = null,
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
          'pl-10 border-l-2 border-l-neutral-300 dark:border-l-primary-dark-300',
      ])}
    >
      {commentsWithCurrentDepth.map((comment) => (
        <div key={comment.id}>
          <CommentItem comment={comment} />
          <CommentsList
            comments={comments}
            parentId={comment.id}
            depth={depth + 1}
          />
        </div>
      ))}
    </div>
  );
};

export default CommentsList;
