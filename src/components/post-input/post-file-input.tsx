import clsx from 'clsx';
import PhotoIcon from '../common/icons/photo';
import UploadImageThumbnail from '../common/upload-image-thumbnail';
import {
  getImageHeightRatio,
  getImageWidthRatio,
} from '../post-card/images-grid';

interface PostFileInputProps {
  selectedImages: File[];
  removeImage: (imageName: string) => void;
  imagesUploadProgress: number[];
  openFilePicker: () => void;
}

const PostFileInput = ({
  imagesUploadProgress,
  selectedImages,
  openFilePicker,
  removeImage,
}: PostFileInputProps) => (
  <>
    <button
      className="cursor-pointer self-start h-6 w-6 mr-auto mb-2"
      onClick={openFilePicker}
      type="button"
    >
      <PhotoIcon />
    </button>

    <div className="grid gap-2 grid-cols-fill">
      {selectedImages.length > 0 &&
        selectedImages.map((image, index) => {
          const widthRatio = getImageWidthRatio(selectedImages.length, index);
          const heightRatio = getImageHeightRatio(selectedImages.length, index);
          return (
            <UploadImageThumbnail
              className={clsx(
                'relative',
                selectedImages.length === 3 && index === 0 && 'row-span-2',
                selectedImages.length === 3 && index === 2 && 'self-end'
              )}
              // className={clsx(
              //   selectedImages.length === 3 && index === 0 && 'row-span-2'
              // )}

              key={image.name}
              image={image}
              imageUploadProgress={imagesUploadProgress[index] || 0}
              removeFile={removeImage}
              imageWidthRatio={widthRatio}
              imageHeightRatio={heightRatio}
            />
          );
        })}
    </div>
  </>
);

export default PostFileInput;
