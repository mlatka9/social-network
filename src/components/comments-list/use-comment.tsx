import React, { useState } from "react";
import {
  useAddCommentMutation,
  useUpdateCommentMutation,
} from "src/hooks/mutation";
import { CommentDetailsType } from "@/types/index";

interface UseCommenProps {
  comment: CommentDetailsType;
}

const useComment = ({ comment }: UseCommenProps) => {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [draftContent, setDraftContent] = useState(comment.message);

  const addComment = useAddCommentMutation(comment.postId);

  const updateComment = useUpdateCommentMutation(comment.postId);

  const onChangeDraftContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDraftContent(e.target.value);
  };
  const toggleIsReplying = () => {
    setIsReplying(!isReplying);
  };

  const toggleIsEditing = () => {
    setIsEditing(!isEditing);
  };

  const handleAddCommentReply = (message: string) => {
    addComment({
      message: message,
      parentId: comment.id,
    });
    setIsReplying(false);
  };

  const handleUpdateComment = () => {
    updateComment({ commentId: comment.id, newContent: draftContent });
    setIsEditing(false);
  };

  return {
    onChangeDraftContent,
    isReplying,
    handleUpdateComment,
    handleAddCommentReply,
    toggleIsEditing,
    toggleIsReplying,
    isEditing,
    draftContent,
  };
};

export default useComment;
