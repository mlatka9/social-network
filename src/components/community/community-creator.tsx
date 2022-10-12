import { useForm } from 'react-hook-form';
import { useAddCommunity } from 'src/hooks/mutation';
import { useCategoryQuery } from 'src/hooks/query';
import FormInput from '@/components/form/form-input';
import { toast } from 'react-toastify';
import FormSelect from '@/components/form/form-select';
import Button from '../common/button';
import FormTextarea from '../form/form-textarea';
import LetterCounter from '../common/letter-counter';

interface FormInputType {
  name: string;
  category: string;
  description: string;
}

interface CommunityCreatorProps {
  handleCloseCreator: () => void;
}

const CommunityCreator = ({ handleCloseCreator }: CommunityCreatorProps) => {
  const onSuccessCb = () => {
    handleCloseCreator();
    toast('Community created', { type: 'success' });
  };

  const addCommunity = useAddCommunity(onSuccessCb);

  const { data: categories, isSuccess } = useCategoryQuery();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormInputType>({
    defaultValues: {
      name: '',
      category: '',
      description: '',
    },
  });

  const onSubmit = (data: FormInputType) => {
    addCommunity({
      name: data.name,
      categoryId: data.category,
      description: data.description,
    });
  };

  if (!isSuccess) return <>Loading</>;

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col space-y-4 pt-2"
    >
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
        rules={{
          required: {
            value: true,
            message: 'Category is required',
          },
        }}
      />
      <Button className="mt-3">Submit</Button>
    </form>
  );
};

export default CommunityCreator;
