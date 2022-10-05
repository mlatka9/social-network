import React from 'react';
import clsx from "clsx";

interface CommentContentProps {
  isEditing: boolean;
  draftContent: string;
  onChangeDraftContent: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleUpdateComment: () => void;
  commentMessage: string;
  parentUserName: string | null;
}

const CommentContent = ({
  draftContent,
  handleUpdateComment,
  isEditing,
  onChangeDraftContent,
  commentMessage,
  parentUserName,
}: CommentContentProps) => (
  <div className="mb-5 ml-14 mt-2">
    {isEditing ? (
      <div className="flex flex-col">
        <textarea
          className="w-full outline-blue-100 outline rounded-md"
          value={draftContent}
          onChange={onChangeDraftContent}
        />
        <button disabled={!draftContent.length}
          type="button"
          onClick={handleUpdateComment}
          className={clsx("ml-auto text-sm bg-blue-500 text-white  rounded-md px-2 py-1 mt-3 hover:bg-blue-400 transition-colors", !draftContent.length && '!bg-blue-500/50 ')}
        >
          Save
        </button>
      </div>
    ) : (
      <p className="text-neutral-800 dark:text-white overflow-hidden whitespace-pre-wrap">
        {parentUserName && (
          <span className="font-semibold text-blue-500 mr-1">
            @{parentUserName}
          </span>
        )}
        {commentMessage}
      </p>
    )}
  </div>
);

export default CommentContent;
