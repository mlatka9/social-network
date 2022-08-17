import ModalWrapper from "./modal-wrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { uploadImage } from "src/utils/cloudinary";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useDropzone } from "react-dropzone";
import { useEffect } from "react";
import useSettingsDropZone from "src/hooks/useSettingsDropzone";

interface ProfileSettingsProps {
  handleCloseSettigns: () => void;
}

export interface IFormInput {
  name: string;
  bio: string;
  image: File[];
  bannerImage: File[];
}

const ProfileSettings = ({ handleCloseSettigns }: ProfileSettingsProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<IFormInput>({
    defaultValues: {
      bio: "",
      name: "",
      bannerImage: undefined,
      image: undefined,
    },
  });

  const {
    acceptedFiles: dropedImages,
    getInputProps: getInputImageProps,
    getRootProps: getRootImageProps,
    open: openImage,
  } = useSettingsDropZone(setValue, "image");

  const {
    acceptedFiles: dropedBanners,
    getInputProps: getInputBannerProps,
    getRootProps: getRootbannerProps,
    open: openBanner,
  } = useSettingsDropZone(setValue, "bannerImage");

  const utils = trpc.useContext();
  const { data } = useSession();

  const draftImageFile = watch("image")?.[0];
  const draftBannerImageFile = watch("bannerImage")?.[0];

  const draftImage = draftImageFile?.name
    ? URL.createObjectURL(draftImageFile)
    : null;

  const draftBannerImage = draftBannerImageFile?.name
    ? URL.createObjectURL(draftBannerImageFile)
    : null;

  const me = trpc.useQuery(["user.getById", { userId: data?.user?.id || "" }], {
    enabled: !!data,
  });

  useEffect(() => {
    if (!me) return;
    setValue("name", me.data?.name || "");
    setValue("bio", me.data?.bio || "");
  }, [me, setValue]);

  if (!data?.user) return <div>loading</div>;

  if (me.status !== "success") return <div>loading</div>;

  const mutation = trpc.useMutation(["user.update"], {
    onSuccess() {
      utils.invalidateQueries(["user.getById", { userId: me.data.id }]);
    },
  });

  const onSubmit = async (data: IFormInput) => {
    const imagesToUpload = [
      { name: "image", file: data.image[0] },
      { name: "bannerImage", file: data.bannerImage[0] },
    ];

    // console.log(data);
    // const res = await uploadImage(imagesToUpload[0].file);
    // console.log(res);

    const [imageUrl, bannerUrl] = await Promise.all(
      imagesToUpload.map((entry) =>
        entry.file ? uploadImage(entry.file) : undefined
      )
    );

    mutation.mutate({
      name: data.name,
      userId: me.data?.id || "",
      bio: data.bio,
      image: imageUrl,
      bannerImage: bannerUrl,
    });

    handleCloseSettigns();
  };

  return (
    <>
      <div
        className="w-full bg-orange-300 h-[150px] relative cursor-pointer group"
        {...getRootbannerProps()}
        onClick={openBanner}
      >
        <Image
          src={
            draftBannerImage || me.data.bannerImage || "/images/fallback.svg"
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
        className="w-32 h-32 bg-orange-500 rounded-full relative -top-16 left-5 overflow-hidden cursor-pointer group z-[100] "
        {...getRootImageProps()}
        onClick={openImage}
      >
        <Image
          src={draftImage || me.data.image || "/images/fallback.svg"}
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
          {...register("bio", { maxLength: 100 })}
          className="bg-neutral-100 px-2 py-1 mt-1 rounded-md mb-5"
        />
        <input type="file" {...register("image")} className="hidden" />
        <input type="file" {...register("bannerImage")} className="hidden" />
        <input
          type="submit"
          className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white cursor-pointer"
        />
      </form>
    </>
  );
};

export default ProfileSettings;
