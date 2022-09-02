import { SearchUserType } from '@/types/db';
import PostMentionsInput from './post-mentions-input';
import SelectedMentionsList from './selected-mentions-list';

interface PostUserPickerProps {
  mentions: SearchUserType[];
  setMention: (mentions: SearchUserType[]) => void;
}

const PostmentionsPicker = ({ mentions, setMention }: PostUserPickerProps) => {
  const handleRemoveMention = (userId: string) => {
    setMention(mentions.filter((mention) => mention.id !== userId));
  };

  return (
    <div className="flex relative mb-3 items-center">
      <SelectedMentionsList
        mentions={mentions}
        handleRemoveMention={handleRemoveMention}
      />
      <PostMentionsInput mentions={mentions} setMentions={setMention} />
    </div>
  );
};

export default PostmentionsPicker;
