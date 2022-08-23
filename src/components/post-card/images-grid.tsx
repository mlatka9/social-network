import { Image as ImageType } from "@prisma/client";
import clsx from "clsx";
import Image from "next/image";

interface ImagesGridProps {
  images: ImageType[];
}

const ImagesGrid = ({ images }: ImagesGridProps) => {
  return (
    <div
      className={clsx([
        "grid  gap-3 auto-rows-[400px] mb-5",
        images.length > 1 && "grid-cols-2",
        images.length > 2 && "auto-rows-[250px]",
      ])}
    >
      {images.length > 0 &&
        images.map((image, index) => (
          <div
            key={image.id}
            className={clsx(
              "w-full h-full relative mb-3",
              images.length === 3 && index === 0 && "row-span-2"
            )}
          >
            <Image
              layout="fill"
              src={image.url}
              objectFit="cover"
              className="rounded-lg"
              alt=""
            />
          </div>
        ))}
    </div>
  );
};

export default ImagesGrid;
