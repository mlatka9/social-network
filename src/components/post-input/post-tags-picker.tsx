import { Control, UseFormSetValue } from 'react-hook-form';
import PostTagsInput from './post-tags-input';
import SelectedTagsList from './selected-tags-list';
import { PostInputFormType } from './types';

interface PostTagInputProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
  disabled: boolean;
}

const PostTagPicker = ({ control, setValue, disabled }: PostTagInputProps) => (
  <div className="flex relative mb-2 items-center flex-wrap ">
    <SelectedTagsList
      control={control}
      setValue={setValue}
      disabled={disabled}
    />
    {!disabled && <PostTagsInput control={control} setValue={setValue} />}
  </div>
);

export default PostTagPicker;
