import React from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';
import FormErrorMessage from './form-error-message';

export type FormInputProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
} & React.ComponentProps<'textarea'>;

const FormTextarea = <TFormValues extends FieldValues>({
  register,
  rules,
  label,
  name,
  error,
  ...props
}: FormInputProps<TFormValues>) => (
  <div>
    <div className="relative pt-2 bg-primary-100 rounded-lg dark:bg-primary-dark-200">
      <textarea
        id={label}
        className="min-h-[110px] max-h-[150px] bg-transparent block px-2 pb-2.5 w-full text-sm text-gray-900  border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0 peer"
        placeholder=" "
        {...(register && register(name, rules))}
        {...props}
      />

      <label
        htmlFor={label}
        className="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2  peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-5 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1"
      >
        {label}
      </label>
    </div>
    {error && <FormErrorMessage message={error.message} />}
  </div>
);

export default FormTextarea;
