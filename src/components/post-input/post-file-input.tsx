import clsx from "clsx";
import Image from "next/image";
import UploadImageThumbnail from "../common/upload-image-thumbnail";

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
}: PostFileInputProps) => {
  return (
    <>
      <button
        className="cursor-pointer self-start h-6 w-6 mr-auto mb-2"
        onClick={openFilePicker}
        type="button"
      >
        <Image
          src="/icons/photo.png"
          width="24"
          height="24"
          alt=""
          className="block"
        />
      </button>
      <div className={clsx(["grid grid-cols-2 gap-3 auto-rows-[200px]"])}>
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <UploadImageThumbnail
              className={clsx(
                selectedImages.length === 3 && index === 0 && "row-span-2"
              )}
              key={image.name}
              image={image}
              imageUploadProgress={imagesUploadProgress[index] || 0}
              removeFile={removeImage}
            />
          ))}
      </div>
    </>
  );
};

export default PostFileInput;
