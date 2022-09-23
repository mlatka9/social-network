import React from 'react';
import { useRouter } from 'next/router';
// import { useElementSize } from 'usehooks-ts';
import { PostDetailsType } from '@/types/db';
import Author from './author';
import TagsList from './tags-list';
import ImagesGrid from './images-grid';
import PostCardFooter from './post-card-footer';
import PostThumbnail from '../post/post-thumbnail';
import CommunityBadge from './community-badge';
import MentionsList from './mentions-list';
import PostCardLink from './post-card-link';
import RepostBadge from './repost-badge';

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
      className=" bg-primary-0 dark:bg-primary-dark-200 w-full p-5 shadow-sm rounded-lg cursor-pointer "
      onClick={goToPostDetails}
    >
      <div className="lg:flex ml-14 space-y-2 lg:space-y-0 lg:space-x-5 items-baseline">
        {post.communityId && post.communityName && (
          <CommunityBadge
            communityId={post.communityId}
            communityName={post.communityName}
          />
        )}
        {post.sharedBy.length > 0 && <RepostBadge users={post.sharedBy} />}
      </div>
      <div className="flex mt-2">
        <Author
          authorId={post.user.id}
          authorImage={post.user.image}
          authorName={post.user.name}
          postCreatedAt={post.createdAt}
        />
      </div>
      <div className="md:ml-14">
        <TagsList tags={post.tags} />
        <div className="relative">
          <p className="mb-3 whitespace-pre-wrap overflow-hidden">
            {post.content}
          </p>
          {post.link && <PostCardLink link={post.link} />}
          <ImagesGrid images={post.images} />
          {post.shareParent && (
            <>
              <div className="mt-3 h-1" />
              <PostThumbnail sharedPost={post.shareParent} />
            </>
          )}
        </div>
        <MentionsList mentions={post.mentions} />
        <PostCardFooter post={post} />
      </div>
    </div>
  );
};

export default PostCard;
