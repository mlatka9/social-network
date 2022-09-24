import { toast } from 'react-toastify';
import TextHeader from '../common/text-header';
import PostInput from '../post-input/post-input';

const HomePostIput = () => {
  const addPostCallback = () => {
    toast('Your post was added successfully', {
      type: 'success',
    });
  };

  return (
    <div className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-lg mt-3 lg:mt-0 mb-5">
      <TextHeader className="pb-3">Post something</TextHeader>
      <hr className="mb-3 dark:border-primary-700" />
      <PostInput submitCallback={addPostCallback} />
    </div>
  );
};

export default HomePostIput;
