import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import { SearchUserType } from '@/types/db';
import PostMentionsInput from './post-mentions-input';
import SelectedMentionsList from './selected-mentions-list';
import { PostInputFormType } from './types';

interface PostUserPickerProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
  disabled: boolean;
}

const PostMentionsPicker = ({
  control,
  setValue,
  disabled,
}: PostUserPickerProps) => {
  const mentions = useWatch({ control, name: 'mentions', defaultValue: [] });

  const setMentions = (newMentions: SearchUserType[]) => {
    setValue('mentions', newMentions);
  };

  const handleRemoveMention = (userId: string) => {
    setValue(
      'mentions',
      mentions.filter((mention) => mention.id !== userId)
    );
  };

  return (
    <div className="flex flex-wrap relative mb-2 items-center">
      <SelectedMentionsList
        mentions={mentions}
        handleRemoveMention={handleRemoveMention}
        disabled={disabled}
      />
      {!disabled && (
        <PostMentionsInput mentions={mentions} setMentions={setMentions} />
      )}
    </div>
  );
};

export default PostMentionsPicker;
