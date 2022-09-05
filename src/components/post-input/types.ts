import { SearchUserType } from '@/types/db';

export interface PostInputFormType {
  content: string;
  tags: string[];
  mentions: SearchUserType[];
  images: File[];
  imagesUploadProgress: number[];
  link: {
    value: string | undefined;
    isOpen: boolean;
  };
}
