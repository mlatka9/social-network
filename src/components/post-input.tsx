import { useSession } from "next-auth/react";
import { FormEvent, useState, useCallback } from "react";
import { trpc } from "../utils/trpc";
import axios from "axios";
import Image from "next/image";
import UserProfilePicture from "./user-profile-image";
import { uploadImage } from "src/utils/cloudinary";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import type { DropTargetMonitor } from "react-dnd";
import { useDrop } from "react-dnd";
import { NativeTypes } from "react-dnd-html5-backend";
import UploadImageThumbnail from "./upload-image-thumbnail";

const PostInput = () => {
  const utils = trpc.useContext();

  const mutation = trpc.useMutation("post.addPost", {
    onSuccess() {
      utils.invalidateQueries("post.getAll");
    },
  });

  const [postContent, setPostContent] = useState("");
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagesUploadProgress, setImagesUploadProgress] = useState<number[]>(
    []
  );

  console.log(imagesUploadProgress);

  const handleFileDrop = useCallback(
    (item: { files: any[] }) => {
      if (item) {
        const files = item.files;
        setSelectedImages([...selectedImages, ...files]);
        setImagesUploadProgress([
          ...imagesUploadProgress,
          ...Array(files.length).fill(0),
        ]);
      }
    },
    [selectedImages, imagesUploadProgress]
  );

  const [{ canDrop, isOver }, drop] = useDrop(
    () => ({
      accept: [NativeTypes.FILE],
      drop(item: { files: any[] }) {
        if (handleFileDrop) {
          handleFileDrop(item);
        }
      },
      canDrop(item: any) {
        console.log("canDrop", item.files, item.items);
        return true;
      },
      hover(item: any) {
        console.log("hover", item.files, item.items);
      },
      collect: (monitor: DropTargetMonitor) => {
        const item = monitor.getItem() as any;
        if (item) {
          console.log("collect", item.files, item.items);
        }
        return {
          isOver: monitor.isOver(),
          canDrop: monitor.canDrop(),
        };
      },
    }),
    [handleFileDrop]
  );

  const me = trpc.useQuery(["user.me"]);

  const handleFormSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (selectedImages.length === 0) return;

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

  const isActive = canDrop && isOver;

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
        <div ref={drop} className="bg-red-200 ml-3 w-full">
          <textarea
            value={postContent}
            onChange={({ target }) => setPostContent(target.value)}
            className="bg-blue-50 w-full rounded-lg placeholder:text-sm pl-2 min-h-[100px] max-h-[200px] block"
          />
        </div>
      </div>
      <div className="flex items-center ml-[50px]">
        <label htmlFor="input-file" className="cursor-pointer self-start">
          <Image src="/icons/photo.png" width="20" height="20" alt="" />
        </label>
        {selectedImages.length > 0 &&
          selectedImages.map((image, index) => {
            return (
              <UploadImageThumbnail
                key={image.name}
                image={image}
                imageUploadProgress={imagesUploadProgress[index] || 0}
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
