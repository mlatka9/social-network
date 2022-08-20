import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";

import UserProfilePicture from "./user-profile-image";
import { uploadImage } from "src/utils/cloudinary";
import { useDropzone } from "react-dropzone";
import { useAddPostMutation } from "src/hooks/mutation";
import PostTagInput from "./post-tag-input";
import PostFileInput from "./post-file-input";
import { useSession } from "next-auth/react";

import type { Tag } from "@prisma/client";

export type LocalTagType = Tag & { status: "created" | "new" };

const PostInput = () => {
  const { data: session } = useSession();

  const [postContent, setPostContent] = useState("");
  const [tags, setTags] = useState<LocalTagType[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesUploadProgress, setImagesUploadProgress] = useState<number[]>(
    []
  );

  const me = session?.user;
  const addPost = useAddPostMutation();

  const {
    getRootProps,
    getInputProps,
    open: openFilePicker,
  } = useDropzone({
    noClick: true,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    onDrop: (files: File[]) => {
      setSelectedImages([...selectedImages, ...files]);
      setImagesUploadProgress(
        Array(selectedImages.length + files.length).fill(0)
      );
    },
    validator: (file: File) => {
      if (selectedImages.some((image) => image.name === file.name)) {
        return {
          code: "file-exists",
          message: `File with name ${file.name} was added already`,
        };
      }
      return null;
    },
  });

  const removeImage = (fileName: string) => {
    setSelectedImages(
      selectedImages.filter((image) => image.name !== fileName)
    );
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const imageUrls = await Promise.all(
      selectedImages.map((file, index) =>
        uploadImage(file, (progress) =>
          setImagesUploadProgress((prev) =>
            prev.map((val, i) => (i === index ? progress : val))
          )
        )
      )
    );

    addPost(postContent, imageUrls, tags);
    setPostContent("");
    setSelectedImages([]);
    setImagesUploadProgress([]);
    setTags([]);
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
            imageUrl={me?.image || "/icons/hart.png"}
            userID={me?.id || ""}
          />
        </div>
        <div
          {...getRootProps({ className: "dropzone" })}
          className=" ml-3 w-full"
        >
          <input {...getInputProps()} />
          <textarea
            value={postContent}
            onChange={({ target }) => setPostContent(target.value)}
            className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 min-h-[100px] max-h-[200px] block mb-3"
          />
          <PostTagInput setTags={setTags} tags={tags} />
          <PostFileInput
            imagesUploadProgress={imagesUploadProgress}
            openFilePicker={openFilePicker}
            removeImage={removeImage}
            selectedImages={selectedImages}
          />
        </div>
      </div>
      <div className="flex items-center ml-[50px]">
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
