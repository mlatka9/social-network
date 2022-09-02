import { Image as ImageType } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';

interface ImagesGridProps {
  images: ImageType[];
}

const getImageWidthRatio = (imageNumber: number, imageIndex: number) => {
  if (imageNumber === 1) {
    return 100;
  }
  if (imageNumber === 2) {
    return 100;
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 50;
    }
    return 50;
  }
  return 100;
};

const getImageHeightRatio = (imageNumber: number, imageIndex: number) => {
  if (imageNumber === 1) {
    return 50;
  }
  if (imageNumber === 2) {
    return 80;
  }
  if (imageNumber === 3) {
    if (imageIndex === 0) {
      return 70;
    }
    return 34;
  }
  return 100;
};

const ImagesGrid = ({ images }: ImagesGridProps) => (
  <div
    className={clsx([
      'grid gap-2 grid-cols-fill',
      images.length > 1 && '',
      images.length > 2 && '',
    ])}
  >
    {images.length > 0 &&
      images.map((image, index) => {
        const widthRatio = getImageWidthRatio(images.length, index);
        const heightRatio = getImageHeightRatio(images.length, index);
        return (
          <div
            key={image.id}
            className={clsx(
              'relative',
              images.length === 3 && index === 0 && 'row-span-2',
              images.length === 3 && index === 2 && 'self-end'
            )}
          >
            <Image
              layout="responsive"
              width={widthRatio}
              height={heightRatio}
              src={image.url}
              objectFit="cover"
              className="rounded-lg"
              alt=""
              sizes="700px"
            />
          </div>
        );
      })}
  </div>
);

export default ImagesGrid;
