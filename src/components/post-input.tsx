import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";
import axios from "axios";
import Image from "next/image";
import UserProfilePicture from "./user-profile-image";
import { uploadImage } from "src/utils/cloudinary";

const PostInput = () => {
  const utils = trpc.useContext();

  const mutation = trpc.useMutation("post.addPost", {
    onSuccess() {
      utils.invalidateQueries("post.getAll");
    },
  });

  const [postContent, setPostContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | undefined>(
    undefined
  );
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  console.log(selectedImage);

  const me = trpc.useQuery(["user.me"]);

  const handleOnImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files && e.target.files.length !== 0 && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const cos = URL.createObjectURL(file);
      console.log("cos", cos);
      // mutation.mutate({ content: postContent });
    } else {
      setSelectedImage(undefined);
    }
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedImage) return;
    const imageUrl = await uploadImage(selectedImage, (progress) =>
      setImageUploadProgress(progress)
    );

    mutation.mutate({
      content: postContent,
      images: imageUrl ? [{ imageAlt: "alt", imageUrl: imageUrl }] : null,
    });

    setPostContent("");
    setSelectedImage(undefined);
    setImageUploadProgress(0);
  };

  return (
    <form onSubmit={handleFormSubmit} className="px-5 py-3 bg-white rounded-xl">
      <p className="font-poppins font-semibold text-neutral-700">
        Post something
      </p>
      <hr className="my-2" />
      <div className="flex mb-5">
        <div className="w-10 h-10 shrink-0">
          <UserProfilePicture
            imageUrl={me.data?.image || "/icons/hart.png"}
            userID={me.data?.id || ""}
          />
        </div>
        <textarea
          value={postContent}
          onChange={({ target }) => setPostContent(target.value)}
          className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 ml-3 min-h-[100px] max-h-[200px]"
        />
      </div>
      <div className="flex items-center ml-[50px]">
        <label htmlFor="input-file" className="cursor-pointer self-start">
          <Image src="/icons/photo.png" width="20" height="20" alt="" />
        </label>
        <input
          className="hidden"
          type="file"
          id="input-file"
          accept="image/*"
          onChange={handleOnImageChange}
        />
        {selectedImage && (
          <div className="ml-5">
            <div className="w-32 h-20 relative ">
              <Image
                src={URL.createObjectURL(selectedImage)}
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
        )}
        <button
          type="submit"
          className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white"
        >
          Share
        </button>
      </div>
    </form>
  );
};

export default PostInput;
