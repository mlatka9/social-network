import { useForm } from 'react-hook-form';
import { useAddCommunity } from 'src/hooks/mutation';
import { useCategoryQuery } from 'src/hooks/query';
import FormInput from '@/components/common/form-input';
import Button from '../common/button';
import FormSelect from '../common/form-select';

interface FormInputType {
  name: string;
  category: string;
}

interface CommunityCreatorProps {
  handleCloseCreator: () => void;
}

const CommunityCreator = ({ handleCloseCreator }: CommunityCreatorProps) => {
  const addCommunity = useAddCommunity(handleCloseCreator);

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
    },
  });

  const onSubmit = (data: FormInputType) => {
    addCommunity({ name: data.name, categoryId: data.category });
    handleCloseCreator();
  };

  if (!isSuccess) return <>Loading</>;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col space-y-4">
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
      <FormSelect
        label="category"
        error={errors.category}
        name="category"
        register={register}
        options={categories}
        watch={watch}
      />
      <Button className="mt-3">Submit</Button>
    </form>
  );
};

export default CommunityCreator;
