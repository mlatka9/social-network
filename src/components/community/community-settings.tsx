import { useForm } from 'react-hook-form';
import uploadImage from 'src/utils/cloudinary';
import { useState } from 'react';
import { useCommunityMutation } from 'src/hooks/mutation';
import { useCategoryQuery } from 'src/hooks/query';
import { CommunityDetailsType } from '@/types/db';
import { toast } from 'react-toastify';
import FormInput from '@/components/form/form-input';
import FormSelect from '@/components/form/form-select';
import FormImages from '../form/form-images';
import FormTextarea from '../form/form-textarea';
import Button from '../common/button';
import LetterCounter from '../common/letter-counter';

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
        image={communityDetails.image || '/images/community-fallback.svg'}
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
              maxLength: {
                message: 'Name can be up to 30 characters long',
                value: 30,
              },
            }}
            register={register}
          />
          <div className="relative">
            <FormTextarea
              label="description"
              name="description"
              error={errors.description}
              register={register}
              rules={{
                maxLength: {
                  message: 'Description can be up to 300 characters long',
                  value: 300,
                },
              }}
            />
            <LetterCounter
              currentLength={watch('description').length}
              maxLength={300}
            />
          </div>
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

        <Button className="mt-3 ml-auto">
          {isUpdating ? 'Updating...' : 'Submit'}
        </Button>
      </form>
    </>
  );
};

export default CommunitySettings;
