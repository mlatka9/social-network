import { FormEvent, useState } from "react";
import UserProfilePicture from "../common/user-profile-image";
import { uploadImage } from "src/utils/cloudinary";
import { useDropzone } from "react-dropzone";
import { useAddPostMutation } from "src/hooks/mutation";
import PostTagPicker from "./post-tags-picker";
import PostFileInput from "./post-file-input";
import { useSession } from "next-auth/react";
import type { Tag } from "@prisma/client";
import clsx from "clsx";
import EmojiPicker from "../common/emoji-picker";
import Button from "../common/button";
import TextHeader from "../common/text-header";

const PostInput = () => {
  const { data: session } = useSession();
  const me = session?.user!;

  const [postContent, setPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesUploadProgress, setImagesUploadProgress] = useState<number[]>(
    []
  );

  const addPost = useAddPostMutation();

  const {
    getRootProps,
    getInputProps,
    isDragActive: isImageDragged,
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

  const appendEmoji = (emoji: string) => {
    setPostContent(postContent + emoji);
  };

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!postContent) return;

    const imageUrls = await Promise.all(
      selectedImages.map((file, index) =>
        uploadImage(file, (progress) =>
          setImagesUploadProgress((prev) =>
            prev.map((val, i) => (i === index ? progress : val))
          )
        )
      )
    );

    addPost(postContent, imageUrls, selectedTags);
    setPostContent("");
    setSelectedImages([]);
    setImagesUploadProgress([]);
    setSelectedTags([]);
  };

  return (
    <form onSubmit={handleFormSubmit} className="px-5 py-3 bg-white rounded-xl">
      <TextHeader>Post something</TextHeader>
      <hr className="my-2" />
      <div className="flex mb-5">
        <UserProfilePicture imageUrl={me.image} userID={me.id} />
        <div
          {...getRootProps()}
          className={clsx(
            "ml-3 w-full",
            isImageDragged && "outline-blue-500 outline-dashed"
          )}
        >
          <input {...getInputProps()} />
          <textarea
            value={postContent}
            onChange={({ target }) => setPostContent(target.value)}
            className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 min-h-[100px] max-h-[200px] block mb-3"
          />
          <PostTagPicker setTags={setSelectedTags} tags={selectedTags} />
          <EmojiPicker appendEmoji={appendEmoji} />
          <PostFileInput
            imagesUploadProgress={imagesUploadProgress}
            openFilePicker={openFilePicker}
            removeImage={removeImage}
            selectedImages={selectedImages}
          />
        </div>
      </div>
      <div className="flex items-center ml-[50px]">
        <Button type="submit">Share</Button>
      </div>
    </form>
  );
};

export default PostInput;
