import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import PostInput from "@/components/post-input/post-input";
import PostList from "@/components/post/post-list";
import { useCommunityPostsQuery } from "src/hooks/query";

const Community = () => {
  const { query } = useRouter();

  const communityId = query.communityId as string;

  const { data, fetchNextPage, hasNextPage } =
    useCommunityPostsQuery(communityId);

  return (
    <div>
      {communityId}
      <PostInput communityId={communityId} />
      <PostList
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </div>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await unstable_getServerSession(
    context.req,
    context.res,
    authOptions
  );

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}
export default Community;
