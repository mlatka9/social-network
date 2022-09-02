import Image from 'next/image';
import { useMemo } from 'react';

interface UploadImageThumbnailProps {
  imageWidthRatio: number;
  imageHeightRatio: number;
  image: File;
  imageUploadProgress: number;
  className: string;
  removeFile: (imageName: string) => void;
}

const UploadImageThumbnail = ({
  image,
  imageUploadProgress,
  removeFile,
  className,
  imageHeightRatio,
  imageWidthRatio,
}: UploadImageThumbnailProps) => {
  const imageSrc = useMemo(() => URL.createObjectURL(image), [image]);
  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => removeFile(image.name)}
        className="absolute top-2 left-2 bg-neutral-800/80  z-[5] w-6 h-6 rounded-full flex justify-center items-center"
      >
        <Image
          src="/icons/close-white.png"
          width="20"
          height="20"
          alt=""
          layout="fixed"
          className="flex"
        />
      </button>

      {/* <div className="w-full h-full relative "> */}
      <div>
        <Image
          src={imageSrc}
          layout="responsive"
          objectFit="cover"
          className="rounded-lg"
          alt=""
          width={imageWidthRatio}
          height={imageHeightRatio}
        />
      </div>

      <div className="w-full h-1 rounded-sm overflow-hidden">
        <div
          className="bg-blue-500 w-full h-full"
          style={{
            transform: `translateX(-${100 - imageUploadProgress}%)`,
          }}
        />
      </div>
    </div>
  );
};

export default UploadImageThumbnail;
