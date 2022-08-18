import { FormEvent, useState } from "react";
import { trpc } from "../utils/trpc";
import Image from "next/image";
import UserProfilePicture from "./user-profile-image";
import { uploadImage } from "src/utils/cloudinary";
import UploadImageThumbnail from "./upload-image-thumbnail";
import { useDropzone } from "react-dropzone";

const PostInput = () => {
  const [postContent, setPostContent] = useState("");
  const [imagesUploadProgress, setImagesUploadProgress] = useState<number[]>(
    []
  );
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const utils = trpc.useContext();

  const mutation = trpc.useMutation("post.addPost", {
    onSuccess() {
      utils.invalidateQueries("post.getAll");
    },
  });

  const { getRootProps, getInputProps, open } = useDropzone({
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

  const removeFile = (fileName: string) => {
    setSelectedImages(
      selectedImages.filter((image) => image.name !== fileName)
    );
  };

  const me = trpc.useQuery(["user.me"]);

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

    mutation.mutate({
      content: postContent,
      images: imageUrls.length
        ? imageUrls.map((url) => ({ imageAlt: "alt", imageUrl: url }))
        : null,
    });

    setPostContent("");
    setSelectedImages([]);
    setImagesUploadProgress([]);
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
        <div
          {...getRootProps({ className: "dropzone" })}
          className=" ml-3 w-full"
        >
          <input {...getInputProps()} />
          <textarea
            value={postContent}
            onChange={({ target }) => setPostContent(target.value)}
            className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 min-h-[100px] max-h-[200px] block"
          />
        </div>
      </div>
      <div className="flex items-center ml-[50px]">
        <div className="cursor-pointer self-start" onClick={open}>
          <Image src="/icons/photo.png" width="20" height="20" alt="" />
        </div>
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => {
            return (
              <UploadImageThumbnail
                key={image.name}
                image={image}
                imageUploadProgress={imagesUploadProgress[index] || 0}
                removeFile={removeFile}
              />
            );
          })}

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
