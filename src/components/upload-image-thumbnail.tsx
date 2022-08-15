import Image from "next/image";
import { useMemo } from "react";

interface UploadImageThumbnail {
  image: File;
  imageUploadProgress: number;
}

const UploadImageThumbnail = ({
  image,
  imageUploadProgress,
}: UploadImageThumbnail) => {
  const imageSrc = useMemo(() => URL.createObjectURL(image), [image]);
  return (
    <div className="ml-5">
      <div className="w-32 h-20 relative ">
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
