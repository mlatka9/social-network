import CommentsList from "@/components/comments-list/comments-list";
import CommentInput from "@/components/comments-list/comment-input";
import { usePostQuery, usePostCommentsQuery } from "src/hooks/query";
import { useAddCommentMutation } from "src/hooks/mutation";
import Author from "../post-card/author";
import TagsList from "../post-card/tags-list";
import ImagesGrid from "../post-card/images-grid";
import PostCardFooter from "../post-card/post-card-footer";
import PostThumbnail from "./post-thumbnail";

interface PostDetailsProps {
  postId: string;
}

const PostDetails = ({ postId }: PostDetailsProps) => {
  const { data: post, isError, isSuccess, error } = usePostQuery(postId);

  const postComments = usePostCommentsQuery(postId);
  const addComment = useAddCommentMutation(postId);

  const handleAddComment = (message: string) => {
    addComment({
      message: message,
      parentId: null,
    });
  };

  if (isError) {
    if (error.data?.code === "NOT_FOUND") {
      return <div>Post was deleted</div>;
    }
    return <div>Unexpected error...</div>;
  }

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className=" w-full rounded-lg grid gap-x-10 ">
        <div className="bg-white w-full mb-5  rounded-lg dark:bg-slate-600">
          <Author
            authorId={post.user.id}
            authorImage={post.user.image}
            authorName={post.user.name}
            postCreatedAt={post.createdAt}
          />
          <TagsList tags={post.tags} />
          <p className="mb-3">{post.content}</p>
          <ImagesGrid images={post.images} />
          {post.shareParent && <PostThumbnail sharedPost={post.shareParent} />}

          <PostCardFooter post={post} />
        </div>

        <CommentInput onMessageSubmit={handleAddComment} />
        {postComments.isSuccess && (
          <CommentsList comments={postComments.data} />
        )}
      </div>
    </>
  );
};

export default PostDetails;
