import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { ToastContainer } from 'react-toastify';
import PostTagPicker from './post-tags-picker';
import PostFileInput from './post-file-input';
import UserProfilePicture from '../common/user-profile-image';
import EmojiPicker from '../common/emoji-picker';
import Button from '../common/button';
import PostThumbnail from '../post/post-thumbnail';
import PostMentionsPicker from './post-mentions-picker';
import { PostDetailsType } from '@/types/db';
import 'react-toastify/dist/ReactToastify.css';
import PostLinkInput from './post-link-input';
import usePostInput from './use-post-input';
import PostContent from './post-content';

interface PostInputProps {
  sharedPost?: PostDetailsType;
  submitCallback?: () => void;
  communityId?: string;
}

const PostInput = ({
  sharedPost,
  submitCallback,
  communityId,
}: PostInputProps) => {
  const { data: session } = useSession();
  const me = session?.user!;

  const {
    handleFormSubmit,
    getRootProps,
    isImageDragged,
    register,
    setValue,
    control,
    openFilePicker,
    finalUploadProgress,
    isSubmitButtonEnabled,
    errors,
    content,
  } = usePostInput({
    sharedPostId: sharedPost?.id,
    submitCallback,
    communityId,
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <ToastContainer autoClose={3000} position="bottom-right" />
      <div className="flex">
        <UserProfilePicture imageUrl={me.image} userID={me.id} />
        <div
          {...getRootProps()}
          className={clsx(
            'ml-3 w-full',
            isImageDragged && 'outline-blue-500 outline-dashed'
          )}
        >
          <PostContent content={content} register={register} />
          <PostTagPicker control={control} setValue={setValue} />
          <PostMentionsPicker control={control} setValue={setValue} />
          <PostLinkInput
            control={control}
            isLinkError={!!errors.link}
            register={register}
          />
          <EmojiPicker setValue={setValue} control={control} />
          <PostFileInput
            openFilePicker={openFilePicker}
            control={control}
            setValue={setValue}
          />
          {finalUploadProgress !== 0 && (
            <div className="w-full h-1 rounded-sm overflow-hidden">
              <div
                className="bg-blue-500 w-full h-full"
                style={{
                  transform: `translateX(-${100 - finalUploadProgress}%)`,
                }}
              />
            </div>
          )}
          <div className="mt-5" />
          {sharedPost && (
            <PostThumbnail sharedPost={sharedPost} isSmall disableLink />
          )}
        </div>
      </div>

      <div className="flex items-center ml-[50px]">
        <Button
          type="submit"
          disabled={!isSubmitButtonEnabled}
          className="ml-auto"
        >
          Share
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
