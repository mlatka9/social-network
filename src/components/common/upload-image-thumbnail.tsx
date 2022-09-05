import Image from 'next/image';
import { useMemo } from 'react';

interface UploadImageThumbnailProps {
  imageWidthRatio: number;
  imageHeightRatio: number;
  image: File;
  className: string;
  removeFile: (imageName: string) => void;
}

const UploadImageThumbnail = ({
  image,
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
    </div>
  );
};

export default UploadImageThumbnail;
