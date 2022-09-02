import { Tag } from '@prisma/client';
import PostTagsInput from './post-tags-input';
import SelectedTagsList from './selected-tags-list';

interface PostTagInputProps {
  tags: Tag[];
  setTags: (tag: Tag[]) => void;
}

const PostTagPicker = ({ setTags, tags }: PostTagInputProps) => {
  const handleRemoveTag = (name: string) => {
    setTags(tags.filter((tag) => tag.name !== name));
  };

  return (
    <div className="flex relative mb-3 items-center">
      <SelectedTagsList tags={tags} handleRemoveTag={handleRemoveTag} />
      <PostTagsInput tags={tags} setTags={setTags} />
    </div>
  );
};

export default PostTagPicker;
