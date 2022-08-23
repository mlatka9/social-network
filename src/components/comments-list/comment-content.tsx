import React from "react";

interface CommentContentProps {
  isEditing: boolean;
  draftContent: string;
  onChangeDraftContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleUpdateComment: () => void;
  commentMessage: string;
}
const CommentContent = ({
  draftContent,
  handleUpdateComment,
  isEditing,
  onChangeDraftContent,
  commentMessage,
}: CommentContentProps) => {
  return (
    <div className="mb-5 ml-14 mt-2">
      {isEditing ? (
        <div className="flex flex-col">
          <textarea
            className="w-full outline-blue-100 outline rounded-md"
            value={draftContent}
            onChange={onChangeDraftContent}
          />
          <button
            onClick={handleUpdateComment}
            className="ml-auto text-sm bg-blue-600 text-white rounded-md px-2 py-1 mt-3 hover:bg-blue-400 transition-colors"
          >
            Save
          </button>
        </div>
      ) : (
        <p className="text-neutral-800">{commentMessage}</p>
      )}
    </div>
  );
};

export default CommentContent;
