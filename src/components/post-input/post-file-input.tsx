import clsx from 'clsx';
import { Control, UseFormSetValue, useWatch } from 'react-hook-form';
import PhotoIcon from '../common/icons/photo';
import UploadImageThumbnail from './upload-image-thumbnail';
import {
  getImageHeightRatio,
  getImageWidthRatio,
} from '../post-card/images-grid';
import { PostInputFormType } from './types';

interface PostFileInputProps {
  control: Control<PostInputFormType>;
  setValue: UseFormSetValue<PostInputFormType>;
  openFilePicker: () => void;
  disabled: boolean;
}

const PostFileInput = ({
  control,
  setValue,
  openFilePicker,
  disabled,
}: PostFileInputProps) => {
  const selectedImages = useWatch({
    control,
    name: 'images',
    defaultValue: [],
  });

  const removeImage = (imageName: string) => {
    setValue('images', [
      ...selectedImages.filter((image) => image.name !== imageName),
    ]);
  };

  return (
    <>
      <button
        className="cursor-pointer self-start h-5 w-5 mr-auto mb-2"
        onClick={openFilePicker}
        type="button"
        disabled={disabled}
      >
        <PhotoIcon />
      </button>

      <div
        className={clsx(
          'grid gap-2',
          selectedImages.length > 1 && '!grid-cols-2'
        )}
      >
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => {
            const widthRatio = getImageWidthRatio(selectedImages.length, index);
            const heightRatio = getImageHeightRatio(
              selectedImages.length,
              index
            );
            return (
              <UploadImageThumbnail
                className={clsx(
                  'relative',
                  selectedImages.length === 3 && index === 0 && 'row-span-2',
                  selectedImages.length === 3 && index === 2 && 'self-end'
                )}
                key={image.name}
                image={image}
                removeFile={removeImage}
                imageWidthRatio={widthRatio}
                imageHeightRatio={heightRatio}
              />
            );
          })}
      </div>
    </>
  );
};

export default PostFileInput;
