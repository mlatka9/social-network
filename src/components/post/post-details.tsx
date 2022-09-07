import { usePostQuery, usePostCommentsQuery } from 'src/hooks/query';
import { useAddCommentMutation } from 'src/hooks/mutation';
import CommentsList from '@/components/comments-list/comments-list';
import CommentInput from '@/components/comments-list/comment-input';
import Author from '../post-card/author';
import TagsList from '../post-card/tags-list';
import PostCardFooter from '../post-card/post-card-footer';
import PostThumbnail from './post-thumbnail';
import CommunityBadge from '../post-card/community-badge';
import PostCardLink from '../post-card/post-card-link';
import ErrorFallback from '../common/error-fallback';
import Loading from '../common/loading';
import ImageGallery from './image-gallery';

interface PostDetailsProps {
  postId: string;
}

const PostDetails = ({ postId }: PostDetailsProps) => {
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

  if (isError) {
    return <ErrorFallback message="This post does't exists" />;
  }

  return (
    <>
      {isPostSuccess ? (
        <div className="mb-20">
          {post.communityId && post.communityName && (
            <CommunityBadge
              communityId={post.communityId}
              communityName={post.communityName}
            />
          )}
          <div className="bg-white w-full mb-5  rounded-lg dark:bg-primary-dark-100 mt-2">
            <Author
              authorId={post.user.id}
              authorImage={post.user.image}
              authorName={post.user.name}
              postCreatedAt={post.createdAt}
            />
            <TagsList tags={post.tags} />
            <p className="mb-3">{post.content}</p>
            {post.link && <PostCardLink link={post.link} />}
            {post.images.length && <ImageGallery images={post.images} />}
            {post.shareParent && (
              <>
                <div className="mt-3 h-1" />
                <PostThumbnail sharedPost={post.shareParent} />
              </>
            )}

            <PostCardFooter post={post} />
          </div>
        </div>
      ) : (
        <Loading height={600} />
      )}

      {isCommentsSuccess ? (
        <>
          <CommentInput onMessageSubmit={handleAddComment} />
          <CommentsList comments={comments} />
        </>
      ) : (
        <Loading height={200} />
      )}
    </>
  );
};

export default PostDetails;
