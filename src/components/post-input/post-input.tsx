import { FormEvent, useEffect, useState } from 'react';

import { uploadImage } from 'src/utils/cloudinary';
import { useDropzone } from 'react-dropzone';
import { useAddPostMutation } from 'src/hooks/mutation';

import { useSession } from 'next-auth/react';
import type { Tag } from '@prisma/client';
import clsx from 'clsx';
import PostTagPicker from './post-tags-picker';
import PostFileInput from './post-file-input';
import UserProfilePicture from '../common/user-profile-image';
import EmojiPicker from '../common/emoji-picker';
import Button from '../common/button';
import PostThumbnail from '../post/post-thumbnail';
import PostmentionsPicker from './post-mentions-picker';
import { PostDetailsType, SearchUserType } from '@/types/db';
import LinkIcon from '../common/icons/link';
import FormErrorMessage from '../common/form-error-message';

const URL_REGEX =
  /[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;

const isUrlValid = (url: string) => URL_REGEX.test(url);

interface PostInputProps {
  sharedPost?: PostDetailsType;
  submitCallback?: () => void;
  communityId?: string;
}

const PostInput = ({
  sharedPost,
  submitCallback = () => {},
  communityId,
}: PostInputProps) => {
  const { data: session } = useSession();
  const me = session?.user!;

  const [postContent, setPostContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedmentions, setSelectedMentions] = useState<SearchUserType[]>(
    []
  );
  const [isUrlInputOpen, setIsUrlInputOpen] = useState(false);
  const [urlInputValue, setUrlInputValue] = useState('');
  const [urlError, setUrlError] = useState('');

  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesUploadProgress, setImagesUploadProgress] = useState<number[]>(
    []
  );

  const addPost = useAddPostMutation(submitCallback);

  useEffect(() => {
    if (!urlError && urlInputValue) return;
    if (isUrlValid(urlInputValue)) setUrlError('');
  }, [urlInputValue, urlError]);

  const {
    getRootProps,
    getInputProps,
    isDragActive: isImageDragged,
    open: openFilePicker,
  } = useDropzone({
    noClick: true,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
    onDrop: (files: File[]) => {
      setSelectedImages([...selectedImages, ...files]);
      setImagesUploadProgress(
        Array(selectedImages.length + files.length).fill(0)
      );
    },
    validator: (file: File) => {
      if (selectedImages.some((image) => image.name === file.name)) {
        return {
          code: 'file-exists',
          message: `File with name ${file.name} was added already`,
        };
      }
      return null;
    },
  });

  const resetInputValues = () => {
    setPostContent('');
    setSelectedImages([]);
    setImagesUploadProgress([]);
    setSelectedTags([]);
    setSelectedMentions([]);
    setUrlError('');
    setUrlInputValue('');
    setIsUrlInputOpen(false);
  };

  const toggleUrlInputOpen = () => {
    setIsUrlInputOpen(!isUrlInputOpen);
  };

  const removeImage = (fileName: string) => {
    setSelectedImages(
      selectedImages.filter((image) => image.name !== fileName)
    );
  };

  const appendEmoji = (emoji: string) => {
    setPostContent(postContent + emoji);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (isUrlInputOpen && !isUrlValid(urlInputValue)) {
      setUrlError('Invalid link');
      return;
    }

    if (!postContent) return;

    const imageUrls = await Promise.all(
      selectedImages.map((file, index) =>
        uploadImage(file, (progress) =>
          setImagesUploadProgress((prev) =>
            prev.map((val, i) => (i === index ? progress : val))
          )
        )
      )
    );

    addPost({
      content: postContent,
      images: imageUrls.length
        ? imageUrls.map((url) => ({ imageAlt: 'alt', imageUrl: url }))
        : null,
      tags: selectedTags,
      mentions: selectedmentions.map((mention) => mention.id),
      shareParentId: sharedPost?.id,
      communityId,
      link: isUrlInputOpen ? urlInputValue : undefined,
    });
    resetInputValues();
  };

  return (
    <form onSubmit={handleFormSubmit} className="">
      <div className="flex">
        <UserProfilePicture imageUrl={me.image} userID={me.id} />
        <div
          {...getRootProps()}
          className={clsx(
            'ml-3 w-full',
            isImageDragged && 'outline-blue-500 outline-dashed'
          )}
        >
          <input {...getInputProps()} />
          <textarea
            value={postContent}
            onChange={({ target }) => setPostContent(target.value)}
            className="bg-primary-100 w-full rounded-lg placeholder:text-sm pl-2 min-h-[100px] max-h-[200px] block mb-3 dark:bg-primary-dark-200"
          />
          <PostTagPicker setTags={setSelectedTags} tags={selectedTags} />
          <PostmentionsPicker
            mentions={selectedmentions}
            setMention={setSelectedMentions}
          />

          <div className="mb-3">
            {isUrlInputOpen && (
              <input
                onChange={({ target }) => setUrlInputValue(target.value)}
                value={urlInputValue}
                className="block  w-full text-md"
                placeholder="Add link"
              />
            )}
            {isUrlInputOpen && urlError && (
              <FormErrorMessage message={urlError} />
            )}
          </div>

          <button type="button" onClick={toggleUrlInputOpen} className="mr-2">
            <LinkIcon />
          </button>
          <EmojiPicker appendEmoji={appendEmoji} />
          <PostFileInput
            imagesUploadProgress={imagesUploadProgress}
            openFilePicker={openFilePicker}
            removeImage={removeImage}
            selectedImages={selectedImages}
          />
          <div className="mt-5" />
          {sharedPost && (
            <PostThumbnail sharedPost={sharedPost} isSmall disableLink />
          )}
        </div>
      </div>

      <div className="flex items-center ml-[50px]">
        <Button type="submit" disabled={!postContent} className="ml-auto">
          Share
        </Button>
      </div>
    </form>
  );
};

export default PostInput;
