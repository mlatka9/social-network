/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import clsx from 'clsx';
import { useMemo } from 'react';
import useSettingsDropZone from 'src/hooks/use-settings-dropzone';
import Image from 'next/image';

interface FormImagesProps {
  image: string | null;
  bannerImage: string | null;
  draftImageFile?: File;
  draftBannerImageFile?: File;
  setImage: (files: File[]) => void;
  setBanner: (files: File[]) => void;
}

const FormImages = ({
  draftBannerImageFile,
  draftImageFile,
  setBanner,
  setImage,
  bannerImage,
  image,
}: FormImagesProps) => {
  const draftImage = useMemo(
    () => (draftImageFile ? URL.createObjectURL(draftImageFile) : null),
    [draftImageFile]
  );

  const draftBannerImage = useMemo(
    () =>
      draftBannerImageFile ? URL.createObjectURL(draftBannerImageFile) : null,
    [draftBannerImageFile]
  );

  const {
    isDragActive: isImageDragged,
    getInputProps: getInputImageProps,
    getRootProps: getRootImageProps,
    open: openImage,
  } = useSettingsDropZone(setImage);

  const {
    isDragActive: isBannerDragged,
    getInputProps: getInputBannerProps,
    getRootProps: getRootbannerProps,
    open: openBanner,
  } = useSettingsDropZone(setBanner);

  return (
    <>
      <div
        className={clsx([
          'w-full h-[150px] relative cursor-pointer group',
          isBannerDragged && 'outline-blue-500 outline-dashed',
        ])}
        {...getRootbannerProps()}
        onClick={openBanner}
      >
        <Image
          src={draftBannerImage || bannerImage || '/images/fallback.svg'}
          layout="fill"
          alt=""
          objectFit="cover"
        />
        <input {...getInputBannerProps()} />
        <div className="absolute inset-0 bg-neutral-800 z-10 opacity-0 group-hover:opacity-70 transition-opacity flex justify-center items-center">
          <Image
            src="/icons/camera-white.png"
            height="30"
            width="30"
            alt=""
            unoptimized
          />
        </div>
      </div>

      <div
        className={clsx([
          'w-32 h-32  rounded-full relative -top-16 left-5 overflow-hidden cursor-pointer group z-[100]',
          isImageDragged && 'outline-blue-500 outline-dashed',
        ])}
        {...getRootImageProps()}
        onClick={openImage}
      >
        <Image
          src={draftImage || image || '/images/avatar-fallback.svg'}
          layout="fill"
          alt=""
          objectFit="cover"
        />
        <input {...getInputImageProps()} />
        <div className="absolute inset-0 bg-neutral-800 z-10 opacity-0 group-hover:opacity-70 transition-opacity flex justify-center items-center">
          <Image
            src="/icons/camera-white.png"
            height="30"
            width="30"
            alt=""
            unoptimized
          />
        </div>
      </div>
    </>
  );
};

export default FormImages;
