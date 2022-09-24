import { PostDetailsType } from '@/types/db';
import { useState } from 'react';
import PostInput from '@/components/post-input/post-input';
import { useToggleUserShareMutation } from '@/hooks/mutation';
import ModalWrapper from '../common/modal-wrapper';
import PostThumbnail from '../post/post-thumbnail';
import Button from '../common/button';

interface PostSharingModalProps {
  closeSharingModal: () => void;
  sharedPost: PostDetailsType;
}

const PostSharingModal = ({
  closeSharingModal,
  sharedPost,
}: PostSharingModalProps) => {
  const [isQuoteShare, setIsQuoteShare] = useState(true);

  const toggleUserShare = useToggleUserShareMutation(closeSharingModal);

  const handleToggleUserShare = () => {
    toggleUserShare({
      postId: sharedPost.id,
    });
  };

  return (
    <ModalWrapper handleCloseModal={closeSharingModal} title="Share">
      <div className="flex items-center mt-1">
        <span className="mr-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          Quote Share
        </span>
        <label
          htmlFor="checked-toggle"
          className="inline-flex relative items-center cursor-pointer"
        >
          <input
            type="checkbox"
            value=""
            id="checked-toggle"
            className="sr-only peer"
            checked={isQuoteShare}
            onChange={() => setIsQuoteShare(!isQuoteShare)}
          />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-500 dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-500" />
        </label>
      </div>

      {isQuoteShare ? (
        <div className="bg-primary-0 dark:bg-primary-dark-200 px-5 py-3 rounded-lg">
          <PostInput
            sharedPost={sharedPost}
            submitCallback={closeSharingModal}
          />
        </div>
      ) : (
        <>
          {sharedPost.sharedByMe && <p>You already sharing this post </p>}
          <Button
            type="button"
            className="ml-auto block"
            onClick={handleToggleUserShare}
          >
            {sharedPost.sharedByMe ? 'Unshare' : 'Share'}
          </Button>
        </>
      )}
      {sharedPost && (
        <div className="mt-5 ">
          <PostThumbnail sharedPost={sharedPost} disableLink />
        </div>
      )}
    </ModalWrapper>
  );
};

export default PostSharingModal;
