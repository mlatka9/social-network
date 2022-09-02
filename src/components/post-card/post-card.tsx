import React from 'react';
import { useRouter } from 'next/router';
import { useElementSize } from 'usehooks-ts';
import Author from './author';
import TagsList from './tags-list';
import ImagesGrid from './images-grid';
import { PostDetailsType } from '@/types/db';
import PostCardFooter from './post-card-footer';
import PostThumbnail from '../post/post-thumbnail';

import CommunityBadge from './community-badge';
import MentionsList from './mentions-list';

export interface PostCardProps {
  post: PostDetailsType;
}

const PostCard = ({ post }: PostCardProps) => {
  const router = useRouter();

  const basePath = router.asPath.split('?')[0];

  const showModalOnClick = basePath === '/';

  const goToPostDetails = () => {
    const url = showModalOnClick ? `${basePath}` : `/post/${post.id}`;

    router.push(
      {
        pathname: url,
        query: { ...router.query, postId: post.id },
      },
      `/post/${post.id}`,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  const [postContentRef, { height }] = useElementSize();

  return (
    <div
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.target !== e.currentTarget) return;
        if (e.code === 'Enter') {
          goToPostDetails();
        }
      }}
      className="bg-primary-0 dark:bg-primary-dark-100 w-full p-5 shadow-sm rounded-lg cursor-pointer"
      onClick={goToPostDetails}
    >
      {post.communityId && post.communityName && (
        <div className="ml-14">
          <CommunityBadge
            communityId={post.communityId}
            communityName={post.communityName}
          />
        </div>
      )}
      <div className="flex mt-2">
        <Author
          authorId={post.user.id}
          authorImage={post.user.image}
          authorName={post.user.name}
          postCreatedAt={post.createdAt}
        />
      </div>
      <div className="ml-14">
        <TagsList tags={post.tags} />

        <div className="relative">
          <div className="max-h-[600px] overflow-hidden" ref={postContentRef}>
            <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
            <ImagesGrid images={post.images} />
            {post.shareParent && (
              <>
                <div className="mt-3 h-1" />
                <PostThumbnail sharedPost={post.shareParent} />
              </>
            )}
          </div>
          {height === 600 && (
            <div className="bg-gradient-to-t from-white  dark:from-primary-dark-100 to-white/0 absolute h-5 w-full bottom-0 flex items-center justify-center text-white" />
          )}
        </div>
        <MentionsList mentions={post.mentions} />
        <PostCardFooter post={post} />
      </div>
    </div>
  );
};

export default React.memo(PostCard);
