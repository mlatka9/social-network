interface FormErrorMessageProps {
  message?: string;
}
const FormErrorMessage = ({ message }: FormErrorMessageProps) => (
  <p className="text-red-500 text-xs mt-1">{message}</p>
);

export default FormErrorMessage;
