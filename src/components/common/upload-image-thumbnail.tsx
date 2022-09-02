import clsx from 'clsx';
import Image from 'next/image';
import { useMemo } from 'react';

interface UploadImageThumbnailProps {
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
}: UploadImageThumbnailProps) => {
  const imageSrc = useMemo(() => URL.createObjectURL(image), [image]);
  return (
    <div className={clsx(['relative'], className)}>
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
      <div className="w-full h-full relative ">
        <Image
          src={imageSrc}
          layout="fill"
          objectFit="cover"
          className="rounded-lg"
          alt=""
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
