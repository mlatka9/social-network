import { useForm } from 'react-hook-form';
import uploadImage from 'src/utils/cloudinary';
import { useState, useEffect } from 'react';
import { useCurrentUserProfileQuery } from 'src/hooks/query';
import { useProfileMutation } from 'src/hooks/mutation';
import { toast } from 'react-toastify';
import FormInput from '@/components/form/form-input';
import FormTextarea from '../form/form-textarea';
import FormImages from '../form/form-images';
import Button from '../common/button';
import Loading from '../common/loading';
import LetterCounter from '../common/letter-counter';

export interface ProfileSettingsFormType {
  name: string;
  bio: string;
  images: File[];
  bannerImages: File[];
}

interface ProfileSettingsProps {
  handleCloseModal: () => void;
}

const ProfileSettings = ({ handleCloseModal }: ProfileSettingsProps) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProfileSettingsFormType>({
    defaultValues: {
      bio: '',
      name: '',
      bannerImages: [],
      images: [],
    },
  });

  const { data: profileData, isSuccess } = useCurrentUserProfileQuery();

  const onSuccess = () => {
    handleCloseModal();
    toast('Your profile was updated', {
      type: 'success',
    });
  };

  const updateProfile = useProfileMutation(onSuccess);

  useEffect(() => {
    if (!isSuccess) return;
    setValue('name', profileData?.name || '');
    setValue('bio', profileData?.bio || '');
  }, [profileData?.name, profileData?.bio, setValue, isSuccess]);

  const draftImageFile = watch('images')[0];
  const draftBannerImageFile = watch('bannerImages')[0];

  const bioLength = watch('bio').length;

  const onSubmit = async (data: ProfileSettingsFormType) => {
    const { name, bio, bannerImages, images } = data;
    setIsUpdating(true);

    const imagesToUpload = [
      { name: 'image', file: images[0] },
      { name: 'bannerImage', file: bannerImages[0] },
    ];

    const [imageUrl, bannerUrl] = await Promise.all(
      imagesToUpload.map((entry) =>
        entry.file ? uploadImage(entry.file) : undefined
      )
    );

    updateProfile({
      name,
      bio,
      image: imageUrl?.url,
      bannerImage: bannerUrl?.url,
    });
    setIsUpdating(false);
  };

  const setImage = (file: File[]) => {
    setValue('images', file);
  };

  const setBanner = (file: File[]) => {
    setValue('bannerImages', file);
  };

  if (!isSuccess)
    return (
      <div className="space-y-10">
        <Loading height={600} />
      </div>
    );

  return (
    <div>
      <FormImages
        bannerImage={profileData.bannerImage}
        image={profileData.image}
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
              label="bio"
              name="bio"
              error={errors.bio}
              register={register}
              rules={{
                maxLength: {
                  message: 'Bio can be up to 300 characters long',
                  value: 300,
                },
              }}
            />
            <LetterCounter currentLength={bioLength} maxLength={300} />
          </div>
        </div>
        <input type="file" {...register('images')} className="hidden" />
        <input type="file" {...register('bannerImages')} className="hidden" />

        <Button className="mt-3 ml-auto">
          {isUpdating ? 'Updating...' : 'Submit'}
        </Button>
      </form>
    </div>
  );
};

export default ProfileSettings;
