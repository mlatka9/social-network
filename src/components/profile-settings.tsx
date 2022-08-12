import ModalWrapper from "./modal-wrapper";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "src/utils/trpc";
import { uploadImage } from "src/utils/cloudinary";
import { useSession } from "next-auth/react";

interface ProfileSettingsProps {
  handleCloseSettigns: () => void;
}

interface IFormInput {
  name: string;
  bio: string;
  image: FileList;
  bannerImage: FileList;
}

const ProfileSettings = ({ handleCloseSettigns }: ProfileSettingsProps) => {
  const { register, handleSubmit } = useForm<IFormInput>();
  const utils = trpc.useContext();
  const me = trpc.useQuery(["user.me"]);

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
  };

  return (
    <ModalWrapper title="Settings" handleCloseModal={handleCloseSettigns}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col space-y-1"
      >
        name:
        <input
          {...register("name", { required: true, maxLength: 20 })}
          className="bg-neutral-100"
        />
        bio:
        <input
          {...register("bio", { maxLength: 100 })}
          className="bg-neutral-100"
        />
        image:
        <input type="file" {...register("image")} />
        bannerImage:
        <input type="file" {...register("bannerImage")} />
        <input type="submit" />
      </form>
    </ModalWrapper>
  );
};

export default ProfileSettings;
