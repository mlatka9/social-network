import { useRouter } from 'next/router';
import Button from './button';

interface ErrorFallbackProps {
  message: string;
}

const ErrorFallback = ({ message }: ErrorFallbackProps) => {
  const router = useRouter();

  const goToHomePage = () => {
    router.push('/');
  };

  return (
    <div className="rounded-xl bg-primary-0 dark:bg-primary-dark-200 w-full h-[300px] font-poppins font-semibold text-primary-800 text-sm dark:text-primary-dark-800 flex justify-center items-center flex-col">
      <p className="mb-5">{message}</p>
      <Button className="ml-[unset]" onClick={goToHomePage}>
        Back to home
      </Button>
    </div>
  );
};

export default ErrorFallback;
