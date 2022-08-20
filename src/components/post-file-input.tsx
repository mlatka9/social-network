import Image from "next/image";
import UploadImageThumbnail from "./upload-image-thumbnail";

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
      <div className="grid grid-cols-2 gap-3">
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => (
            <UploadImageThumbnail
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
