import { useForm } from "react-hook-form";
import { uploadImage } from "src/utils/cloudinary";
import Image from "next/image";
import { useState, useEffect, useMemo } from "react";
import useSettingsDropZone from "src/hooks/use-settings-dropzone";
import { useCommunityDetailsQuery, useCurrentUserQuery } from "src/hooks/query";
import { useCommunityMutation, useProfileMutation } from "src/hooks/mutation";
import clsx from "clsx";
import { CommunityDetailsType } from "@/types/index";

export interface FormInputType {
  name: string;
  description: string;
  images: File[];
  bannerImages: File[];
}

interface CommunitySettingsProps {
  communityDetails: CommunityDetailsType;
}

const CommunitySettings = ({ communityDetails }: CommunitySettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const { register, handleSubmit, setValue, watch } = useForm<FormInputType>({
    defaultValues: {
      description: communityDetails.description,
      name: communityDetails.name,
      bannerImages: [],
      images: [],
    },
  });

  const {
    isDragActive: isImageDragged,
    getInputProps: getInputImageProps,
    getRootProps: getRootImageProps,
    open: openImage,
  } = useSettingsDropZone(setValue, "images");

  const {
    isDragActive: isBannerDragged,
    getInputProps: getInputBannerProps,
    getRootProps: getRootbannerProps,
    open: openBanner,
  } = useSettingsDropZone(setValue, "bannerImages");

  const draftImageFile = watch("images")[0];
  const draftBannerImageFile = watch("bannerImages")[0];

  const draftImage = useMemo(
    () => (draftImageFile ? URL.createObjectURL(draftImageFile) : null),
    [draftImageFile]
  );

  const draftBannerImage = useMemo(
    () =>
      draftBannerImageFile ? URL.createObjectURL(draftBannerImageFile) : null,
    [draftBannerImageFile]
  );

  const updateCommunity = useCommunityMutation();

  // useEffect(() => {
  //   if (!me) return;
  //   setValue("name", me.name || "");
  //   setValue("bio", me.bio);
  // }, [me, setValue]);

  const onSubmit = async (data: FormInputType) => {
    const { name, description, bannerImages, images } = data;
    const imagesToUpload = [
      { name: "image", file: images[0] },
      { name: "bannerImage", file: bannerImages[0] },
    ];

    setIsUpdating(true);

    const [imageUrl, bannerUrl] = await Promise.all(
      imagesToUpload.map((entry) =>
        entry.file ? uploadImage(entry.file) : undefined
      )
    );

    updateCommunity({
      communityId: communityDetails.id,
      name,
      description,
      image: imageUrl,
      bannerImage: bannerUrl,
    });
    setIsUpdating(false);
  };

  return (
    <>
      <div
        className={clsx([
          "w-full h-[150px] relative cursor-pointer group",
          isBannerDragged && "outline-blue-500 outline-dashed",
        ])}
        {...getRootbannerProps()}
        onClick={openBanner}
      >
        <Image
          src={
            draftBannerImage ||
            communityDetails.bannerImage ||
            "/images/fallback.svg"
          }
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
          "w-32 h-32  rounded-full relative -top-16 left-5 overflow-hidden cursor-pointer group z-[100]",
          isImageDragged && "outline-blue-500 outline-dashed",
        ])}
        {...getRootImageProps()}
        onClick={openImage}
      >
        <Image
          src={draftImage || communityDetails.image || "/images/fallback.svg"}
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

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <p className="text-neutral-600 text-sm">name</p>
        <input
          {...register("name", { required: true, maxLength: 20 })}
          className="bg-neutral-100 px-2 py-1 mt-1 rounded-md mb-5"
        />

        <p className="text-neutral-600 text-sm">bio</p>
        <input
          {...register("description", { maxLength: 100 })}
          className="bg-neutral-100 px-2 py-1 mt-1 rounded-md mb-5"
        />
        <input type="file" {...register("images")} className="hidden" />
        <input type="file" {...register("bannerImages")} className="hidden" />
        <button
          type="submit"
          className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white cursor-pointer"
        >
          {isUpdating ? "Updating..." : "Submit"}
        </button>
      </form>
    </>
  );
};

export default CommunitySettings;
