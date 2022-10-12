import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { PostDetailsType } from '@/types/db';
import PostTagPicker from '@/components/post-input/post-tags-picker';
import Image from 'next/image';
import PostFileInput from './post-file-input';
import EmojiPicker from './emoji-picker';
import Button from '../common/button';
import PostMentionsPicker from './post-mentions-picker';
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
    getInputProps,
    isUploading,
  } = usePostInput({
    sharedPostId: sharedPost?.id,
    submitCallback,
    communityId,
  });

  return (
    <form onSubmit={handleFormSubmit}>
      <div className="flex">
        <div className="w-10 h-10">
          <Image
            src={me.image || '/images/avatar-fallback.svg'}
            width="40"
            height="40"
            layout="fixed"
            alt=""
            className="rounded-lg"
            objectFit="cover"
          />
        </div>
        <div
          {...getRootProps()}
          className={clsx(
            'ml-3 w-full',
            isImageDragged && 'outline-blue-500 outline-dashed'
          )}
        >
          <PostContent
            content={content}
            register={register}
            disabled={isUploading}
          />
          <PostTagPicker
            control={control}
            setValue={setValue}
            disabled={isUploading}
          />
          <PostMentionsPicker
            control={control}
            setValue={setValue}
            disabled={isUploading}
          />
          <PostLinkInput
            control={control}
            isLinkError={!!errors.link}
            register={register}
            disabled={isUploading}
          />
          <EmojiPicker
            setValue={setValue}
            control={control}
            disabled={isUploading}
          />
          <PostFileInput
            openFilePicker={openFilePicker}
            control={control}
            setValue={setValue}
            disabled={isUploading}
          />
          <input {...getInputProps()} />

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
        </div>
      </div>

      <div className="flex items-center ml-[50px] mt-5">
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
