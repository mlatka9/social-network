import { usePostQuery, usePostCommentsQuery } from 'src/hooks/query';
import { useAddCommentMutation } from 'src/hooks/mutation';
import CommentsList from '@/components/comments-list/comments-list';
import CommentInput from '@/components/comments-list/comment-input';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Author from '../post-card/author';
import TagsList from '../post-card/tags-list';
import PostCardFooter from '../post-card/post-card-footer';
import PostThumbnail from './post-thumbnail';
import CommunityBadge from '../post-card/community-badge';
import PostCardLink from '../post-card/post-card-link';
import ErrorFallback from '../common/error-fallback';
import Loading from '../common/loading';
import ImageGallery from './image-gallery';
import RepostBadge from '../post-card/repost-badge';
import MentionsList from '../post-card/mentions-list';

interface PostDetailsProps {
  postId: string;
}

const PostDetails = ({ postId }: PostDetailsProps) => {
  const router = useRouter();

  const {
    data: post,
    isError,
    isSuccess: isPostSuccess,
  } = usePostQuery(postId);

  const { data: comments, isSuccess: isCommentsSuccess } =
    usePostCommentsQuery(postId);

  const addComment = useAddCommentMutation(postId);

  const handleAddComment = (message: string) => {
    addComment({
      message,
      parentId: null,
    });
  };

  useEffect(() => {
    if (!isCommentsSuccess) return;
    const commentId = router.asPath.split('#')[1];
    if (!commentId) return;
    const selector = `#comment-${commentId}`;
    try {
      const commentElement = document.querySelector(selector);
      if (!commentElement) return;
      commentElement.scrollIntoView({ behavior: 'smooth' });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log('invalide comment id');
    }
  }, [router.asPath, isCommentsSuccess]);

  if (isError) {
    return <ErrorFallback message="This post does't exists" />;
  }

  return (
    <>
      {isPostSuccess ? (
        <>
          <div className="mb-20">
            <div className="lg:flex space-y-2 lg:space-y-0 lg:space-x-5 items-baseline ml-14">
              {post.communityId && post.communityName && (
                <CommunityBadge
                  communityId={post.communityId}
                  communityName={post.communityName}
                />
              )}
              {!!post.sharedBy.length && <RepostBadge users={post.sharedBy} />}
            </div>
            <div className=" w-full mb-5  rounded-lg mt-2">
              <Author
                authorId={post.user.id}
                authorImage={post.user.image}
                authorName={post.user.name}
                postCreatedAt={post.createdAt}
              />
              <TagsList tags={post.tags} />
              <p className="mb-3 overflow-hidden">{post.content}</p>
              {post.link && <PostCardLink link={post.link} />}
              {!!post.images.length && <ImageGallery images={post.images} />}
              {post.shareParent && (
                <>
                  <div className="mt-3 h-1" />
                  <PostThumbnail sharedPost={post.shareParent} />
                </>
              )}
              <MentionsList mentions={post.mentions} />
              <PostCardFooter post={post} />
            </div>
          </div>
          <CommentInput onMessageSubmit={handleAddComment} />
        </>
      ) : (
        <Loading height={600} />
      )}

      {isCommentsSuccess ? (
        <CommentsList comments={comments} />
      ) : (
        <Loading height={200} />
      )}
    </>
  );
};

export default PostDetails;
