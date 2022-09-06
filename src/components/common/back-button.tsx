import { useRouter } from 'next/router';
import ArrowLeftIcon from './icons/arrow-left';

const BackButton = () => {
  const router = useRouter();

  const onClickBack = () => {
    router.back();
  };

  if (router.pathname === '/') return null;

  return (
    <button
      type="button"
      onClick={onClickBack}
      className="my-3 text-sm font-poppins font-semibold flex items-center fill-blue-500 hover:fill-blue-400"
    >
      <ArrowLeftIcon width={16} height={16} />
      <p className="ml-2 text-blue-500 hover:text-blue-400">Back</p>
    </button>
  );
};

export default BackButton;
