import { useDropzone } from 'react-dropzone';
import { SubmitErrorHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import uploadImage from 'src/utils/cloudinary';
import { useAddPostMutation } from '@/hooks/mutation';
import { useState } from 'react';
import { PostInputFormType } from './types';

const MAX_FILES_NUMBER = 4;

interface UsePostInputProps {
  submitCallback?: () => void;
  communityId?: string;
  sharedPostId?: string;
}

const usePostInput = ({
  submitCallback,
  communityId,
  sharedPostId,
}: UsePostInputProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<PostInputFormType>({
    defaultValues: {
      content: '',
      tags: [],
      mentions: [],
      images: [],
      imagesUploadProgress: [],
      link: {
        isOpen: false,
        value: undefined,
      },
    },
  });

  const addPost = useAddPostMutation(submitCallback);

  const setImages = (files: File[]) => {
    const currentImages = getValues('images');

    if (files.length + currentImages.length > MAX_FILES_NUMBER) {
      toast('You can add up to 4 images', {
        type: 'error',
      });
    }

    const imagesToVerify = files.slice(
      0,
      MAX_FILES_NUMBER - currentImages.length
    );

    setValue('images', [...getValues('images'), ...imagesToVerify]);
  };

  const selectedImages = watch('images');

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
      setImages(files);
      setValue(
        'imagesUploadProgress',
        Array(selectedImages.length + files.length).fill(0)
      );
    },
    disabled: isUploading,
    validator: (file: File) => {
      if (getValues('images').some((image) => image.name === file.name)) {
        return {
          code: 'file-exists',
          message: `File with name ${file.name} was added already`,
        };
      }
      return null;
    },
  });

  const sumOfCurrentUploaded = watch('imagesUploadProgress').reduce(
    (sum, entry) => sum + entry,
    0
  );

  const finalUploadProgress = sumOfCurrentUploaded / selectedImages.length || 0;

  const onSubmit = async (data: PostInputFormType) => {
    setIsUploading(true);
    const { content, images, link, mentions, tags } = data;

    const imageUrls = await Promise.all(
      images.map((file, index) =>
        uploadImage(file, (progress) => {
          const imagesUploadProgress = getValues('imagesUploadProgress');
          setValue(
            'imagesUploadProgress',
            imagesUploadProgress.map((val, i) => (i === index ? progress : val))
          );
        })
      )
    );

    addPost({
      content,
      images: imageUrls.length
        ? imageUrls.map((image) => ({
            imageAlt: 'alt',
            imageUrl: image.url,
            fallbackUrl: image.fallbackUrl,
            width: image.width,
            height: image.height,
          }))
        : null,
      tags,
      mentions: mentions.map((mention) => mention.id),
      shareParentId: sharedPostId,
      communityId,
      link: getValues('link.isOpen') ?  link.value : undefined,
    });

    reset();
    setIsUploading(false);
  };

  const onError: SubmitErrorHandler<PostInputFormType> = (e) => {
    if (e.link) {
      toast('Provide valid link', {
        type: 'error',
      });
    }
  };

  const content = watch('content');

  const handleFormSubmit = handleSubmit(onSubmit, onError);

  const contentLength = content.trim().length;

  const isSubmitButtonEnabled =
    !isUploading && contentLength > 0 && contentLength <= 280;

  return {
    isUploading,
    control,
    setValue,
    handleFormSubmit,
    getRootProps,
    isImageDragged,
    getInputProps,
    register,
    openFilePicker,
    finalUploadProgress,
    isSubmitButtonEnabled,
    errors,
    content,
  };
};

export default usePostInput;
