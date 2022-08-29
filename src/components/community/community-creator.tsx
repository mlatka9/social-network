import { useForm } from "react-hook-form";
import { useAddCommunity } from "src/hooks/mutation";

interface FormInputType {
  name: string;
}

interface CommunityCreatorProps {
  handleCloseCreator: () => void;
}

const CommunityCreator = ({ handleCloseCreator }: CommunityCreatorProps) => {
  const addCommunity = useAddCommunity(handleCloseCreator);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormInputType>({
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: FormInputType) => {
    addCommunity({ name: data.name });
    handleCloseCreator();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label htmlFor="name">name</label>
      <input
        id="name"
        {...register("name", {
          required: true,
          minLength: {
            message: "Community name must have at least 3 characters",
            value: 3,
          },
        })}
      />
      {errors.name && <p>{errors.name.message}</p>}
    </form>
  );
};

export default CommunityCreator;
