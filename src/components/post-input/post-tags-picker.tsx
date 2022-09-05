import { Control, UseFormSetValue } from 'react-hook-form';
import PostTagsInput from './post-tags-input';
import SelectedTagsList from './selected-tags-list';
import { PostInputFormType } from './types';

interface PostTagInputProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
}

const PostTagPicker = ({ control, setValue }: PostTagInputProps) => (
  <div className="flex relative mb-2 items-center flex-wrap ">
    <SelectedTagsList control={control} setValue={setValue} />
    <PostTagsInput control={control} setValue={setValue} />
  </div>
);

export default PostTagPicker;
