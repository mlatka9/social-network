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
      className="bg-primary-0 dark:bg-primary-dark-200 w-full p-5 shadow-sm rounded-lg cursor-pointer"
      onClick={goToPostDetails}
    >
      <div className="flex">
        {post.communityId && post.communityName && (
          <div className="ml-14">
            <CommunityBadge
              communityId={post.communityId}
              communityName={post.communityName}
            />
          </div>
        )}
        {post.sharedBy.length > 0 && (
          <div className="ml-14">
            <RepostBadge users={post.sharedBy} />
          </div>
        )}
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
          <p className="mb-3 whitespace-pre-wrap">{post.content}</p>
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

export default React.memo(PostCard);
