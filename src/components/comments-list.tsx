import clsx from "clsx";
import React from "react";
import type { CommentWithCountsType } from "./comment-box";
import CommentBox from "./comment-box";

const groupCommentsByParentId = (
  comments: CommentWithCountsType[]
): Map<string | null, CommentWithCountsType[]> => {
  const groups = new Map<string | null, CommentWithCountsType[]>();

  comments.forEach((comment) => {
    if (groups.has(comment.parentId)) {
      const comments = groups.get(comment.parentId);
      if (comments) {
        groups.set(comment.parentId, [...comments, comment]);
      }
    } else {
      groups.set(comment.parentId, [comment]);
    }
  });

  return groups;
};

interface CommentsListProps {
  comments: CommentWithCountsType[];
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
  //   console.log(commentsWithCurrentDepth);

  if (!commentsWithCurrentDepth) return <></>;

  return (
    <div
      className={clsx([
        "w-full ",
        depth !== 0 && "pl-10 border-l-2 border-l-neutral-300",
      ])}
    >
      {commentsWithCurrentDepth.map((comment) => (
        <div key={comment.id}>
          <CommentBox comment={comment} />
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
