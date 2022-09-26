import Image from 'next/image';
import { SearchUserType } from '@/types/db';

interface SelectedTagsListProps {
  mentions: SearchUserType[];
  handleRemoveMention: (mentionId: string) => void;
  disabled: boolean;
}

const SelectedMentionsList = ({
  mentions,
  handleRemoveMention,
  disabled,
}: SelectedTagsListProps) => (
  <div className="w-fit flex shrink-0">
    {mentions.map((mention) => (
      <div
        className="rounded-md p-1 mr-2 flex items-center bg-blue-400 text-white "
        key={mention.id}
      >
        <span>@{mention.name}</span>
        {!disabled && (
          <button
            type="button"
            onClick={() => handleRemoveMention(mention.id)}
            className="ml-1 justify-center flex items-center shrink-0 w-4 h-4"
          >
            <Image src="/icons/close.png" height="16" width="16" alt="" />
          </button>
        )}
      </div>
    ))}
  </div>
);

export default SelectedMentionsList;
