import { useDropzone } from "react-dropzone";
import type { IFormInput } from "@/components/profile-settings";
import { UseFormSetValue } from "react-hook-form";

const useSettingsDropZone = (
  setFormValue: UseFormSetValue<IFormInput>,
  formFieldName: "image" | "bannerImage"
) => {
  const { getRootProps, getInputProps, acceptedFiles, open } = useDropzone({
    noClick: true,
    multiple: false,
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    onDrop: (files: File[]) => {
      if (files[0]) {
        setFormValue(formFieldName, files);
      }
    },
  });

  return { getRootProps, getInputProps, open, acceptedFiles };
};

export default useSettingsDropZone;
