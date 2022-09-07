import { useForm } from 'react-hook-form';
import uploadImage from 'src/utils/cloudinary';
import { useState } from 'react';
import { useCommunityMutation } from 'src/hooks/mutation';
import { useCategoryQuery } from 'src/hooks/query';
import { CommunityDetailsType } from '@/types/db';
import { toast } from 'react-toastify';
import FormImages from '../common/form-images';
import FormTextarea from '../common/form-textarea';
import FormInput from '../common/form-input';
import Button from '../common/button';
import FormSelect from '../common/form-select';

export interface CommunitySettingsFormType {
  name: string;
  description: string;
  images: File[];
  bannerImages: File[];
  category: string;
}

interface CommunitySettingsProps {
  communityDetails: CommunityDetailsType;
  handleCloseModal: () => void;
}

const CommunitySettings = ({
  communityDetails,
  handleCloseModal,
}: CommunitySettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<CommunitySettingsFormType>({
    defaultValues: {
      description: communityDetails.description,
      name: communityDetails.name,
      bannerImages: [],
      images: [],
      category: communityDetails.categoryId,
    },
  });

  const { data: categories, isSuccess: isCategorySuccess } = useCategoryQuery();

  const draftImageFile = watch('images')[0];
  const draftBannerImageFile = watch('bannerImages')[0];

  const onSuccess = () => {
    handleCloseModal();
    toast('Your community profile was updated', {
      type: 'success',
    });
  };

  const updateCommunity = useCommunityMutation(onSuccess);

  const onSubmit = async (data: CommunitySettingsFormType) => {
    const { name, description, bannerImages, images, category } = data;

    const imagesToUpload = [
      { name: 'image', file: images[0] },
      { name: 'bannerImage', file: bannerImages[0] },
    ];

    setIsUpdating(true);

    const [imageUrl, bannerUrl] = await Promise.all(
      imagesToUpload.map((entry) =>
        entry.file ? uploadImage(entry.file) : undefined
      )
    );

    updateCommunity({
      communityId: communityDetails.id,
      name,
      description,
      image: imageUrl?.url,
      bannerImage: bannerUrl?.url,
      category,
    });
    setIsUpdating(false);
  };

  const setImage = (file: File[]) => {
    setValue('images', file);
  };

  const setBanner = (file: File[]) => {
    setValue('bannerImages', file);
  };

  if (!isCategorySuccess) return <>Loading..</>;

  return (
    <>
      <FormImages
        bannerImage={communityDetails.bannerImage}
        image={communityDetails.image}
        draftBannerImageFile={draftBannerImageFile}
        draftImageFile={draftImageFile}
        setBanner={setBanner}
        setImage={setImage}
      />

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
        <div className="space-y-6">
          <FormInput
            label="name"
            name="name"
            error={errors.name}
            rules={{
              required: {
                value: true,
                message: 'Name is required',
              },
              minLength: {
                message: 'Name must be at least 3 characters long',
                value: 3,
              },
            }}
            register={register}
          />

          <FormTextarea
            label="description"
            name="description"
            error={errors.description}
            register={register}
            rules={{
              maxLength: {
                message: 'Bio can be up to 300 characters long',
                value: 300,
              },
            }}
          />

          <FormSelect
            label="category"
            error={errors.category}
            name="category"
            register={register}
            options={categories}
            watch={watch}
          />
        </div>

        <input type="file" {...register('images')} className="hidden" />
        <input type="file" {...register('bannerImages')} className="hidden" />

        <Button className="mt-3">
          {isUpdating ? 'Updating...' : 'Submit'}
        </Button>
      </form>
    </>
  );
};

export default CommunitySettings;
