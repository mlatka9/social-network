import { Image as ImageType } from '@prisma/client';
import clsx from 'clsx';
import Image from 'next/image';

import React, { useState } from 'react';
import ChevronLeftIcon from '../common/icons/chevron-left';
import ChevronRightIcon from '../common/icons/chevron-right';

interface ImageGalleryProps {
  images: ImageType[];
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const isPrevImage = currentImageIndex !== 0;
  const isNextImage = currentImageIndex + 1 !== images.length;

  const setNextImage = () => {
    if (isNextImage) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const setPrevImage = () => {
    if (isPrevImage) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  if (images.length === 1) {
    const image = images[0]!;
    return (
      <div className="relative">
        <Image
          src={image.fallbackUrl}
          layout="fill"
          objectFit="contain"
          className="blur-sm"
          unoptimized
        />
        <Image
          unoptimized
          src={image.url}
          width={image.width}
          height={image.height}
          layout="responsive"
          objectFit="contain"
        />
      </div>
    );
  }

  return (
    <div className="relative flex h-[300px] lg:h-[500px]">
      {images.map((image, index) => (
        <React.Fragment key={image.id}>
          <Image
            src={image.fallbackUrl}
            layout="fill"
            objectFit="contain"
            unoptimized
            className={clsx(
              'transition-all duration-300 absolute blur-sm',
              index < currentImageIndex && '-translate-x-full opacity-0',
              index > currentImageIndex && 'translate-x-full opacity-0'
            )}
          />
          <Image
            unoptimized
            src={image.url}
            layout="fill"
            objectFit="contain"
            className={clsx(
              'transition-all duration-300 absolute',
              index < currentImageIndex && '-translate-x-full opacity-0',
              index > currentImageIndex && 'translate-x-full opacity-0'
            )}
          />
        </React.Fragment>
      ))}

      {isPrevImage && (
        <button
          type="button"
          onClick={setPrevImage}
          className="z-2 bg-primary-700/50 p-1 rounded-full absolute top-1/2 -translate-y-1/2 left-2"
        >
          <ChevronLeftIcon width={20} height={20} />
        </button>
      )}
      {isNextImage && (
        <button
          type="button"
          onClick={setNextImage}
          className="z-2 bg-primary-700/50 p-1 rounded-full absolute top-1/2 -translate-y-1/2 right-2"
        >
          <ChevronRightIcon width={20} height={20} />
        </button>
      )}
    </div>
  );
};

export default ImageGallery;
