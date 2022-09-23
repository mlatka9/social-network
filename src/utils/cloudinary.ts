import axios from 'axios';


const CLOUDINARY_UPLOAD_PRESET = 'uvm9hyxi';
const CLOUDINARY_UPLOAD_FALLBACK_PRESET = 'keonszjo';
const CLOUDINARY_UPLOAD_LINK =
  'https://api.cloudinary.com/v1_1/dw6bikqwf/image/upload';

interface UploadImageType {
  url: string;
  fallbackUrl: string,
  width: number;
  height: number;
}

const uploadImage = async (
  selectedImage: File,
  uploadProgressCalback?: (progress: number) => void
): Promise<UploadImageType> => {

  const formData = new FormData();
  formData.append('file', selectedImage);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

  const request =  axios.post(CLOUDINARY_UPLOAD_LINK, formData, {
    onUploadProgress: (progressEvent) => {
      const percentageProgress =
        (progressEvent.loaded / progressEvent.total) * 100;
      if (uploadProgressCalback) {
        uploadProgressCalback(percentageProgress);
      }
    },
  });

  const fallbackFormData = new FormData();
  fallbackFormData.append('file', selectedImage);
  fallbackFormData.append('upload_preset', CLOUDINARY_UPLOAD_FALLBACK_PRESET);

  const fallbackRequest =  axios.post(CLOUDINARY_UPLOAD_LINK, fallbackFormData);
  const [response, fallbackResponse] = await Promise.all([request, fallbackRequest])

  return {
    url: response.data.secure_url,
    fallbackUrl: fallbackResponse.data.secure_url,
    width: response.data.width,
    height: response.data.height,
  };
};

export default uploadImage;
