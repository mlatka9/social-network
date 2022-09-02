import { useDropzone } from 'react-dropzone';

const useSettingsDropZone = (setFormValue: (files: File[]) => void) =>
  useDropzone({
    noClick: true,
    multiple: false,
    accept: {
      'image/*': ['.png', '.gif', '.jpeg', '.jpg'],
    },
    onDrop: (files: File[]) => {
      if (files[0]) {
        setFormValue(files);
      }
    },
  });

export default useSettingsDropZone;
