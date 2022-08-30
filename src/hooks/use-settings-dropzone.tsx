import { useDropzone } from "react-dropzone";
import type { IFormInput } from "@/components/common/profile-settings";
import { UseFormSetValue } from "react-hook-form";

type fieldNameType = "images" | "bannerImages";

const useSettingsDropZone = (
  setFormValue: (fieldName: fieldNameType, files: File[]) => void,
  formFieldName: fieldNameType
) => {
  return useDropzone({
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
};

export default useSettingsDropZone;
