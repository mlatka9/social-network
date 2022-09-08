import clsx from 'clsx';
import React from 'react';
import {
  FieldError,
  FieldValues,
  Path,
  RegisterOptions,
  UseFormRegister,
  UseFormWatch,
} from 'react-hook-form';
import FormErrorMessage from './form-error-message';

type FormSelectOptionType = { id: string; name: string };

export type FormSelectProps<TFormValues extends FieldValues> = {
  label: string;
  name: Path<TFormValues>;
  rules?: RegisterOptions;
  register?: UseFormRegister<TFormValues>;
  error: FieldError | undefined;
  options: FormSelectOptionType[];
  watch: UseFormWatch<TFormValues>;
} & React.ComponentProps<'select'>;

const FormSelect = <TFormValues extends FieldValues>({
  register,
  rules,
  label,
  name,
  error,
  options,
  watch,
  ...props
}: FormSelectProps<TFormValues>) => {
  const selectedValue = watch(name);

  return (
    <div>
      <div className="relative">
        <select
          id={label}
          className="bg-primary-100 block px-2 pb-2.5 pt-4 w-full text-sm dark:bg-primary-dark-200 rounded-lg border-1 border-gray-300 appearance-none dark:text-white dark:border-gray-600  focus:outline-none focus:ring-0  peer"
          placeholder=" "
          {...(register && register(name, rules))}
          {...props}
        >
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.name}
            </option>
          ))}
        </select>
        <label
          htmlFor={label}
          className={clsx(
            'pointer-events-none absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-5 scale-75 top-2 z-10 origin-[0] px-2 peer-focus:px-2   peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 left-1',
            !selectedValue && 'scale-100 -translate-y-1/2 top-1/2 '
          )}
        >
          {label}
        </label>
      </div>
      {error && <FormErrorMessage message={error.message} />}
    </div>
  );
};

export default FormSelect;
