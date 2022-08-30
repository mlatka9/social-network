import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { authOptions } from "../api/auth/[...nextauth]";
import PostInput from "@/components/post-input/post-input";
import PostList from "@/components/post/post-list";
import { useCommunityPostsQuery } from "src/hooks/query";
import CommunityProfileHero from "@/components/community/community-profile-hero";
import Layout from "@/components/common/layout";
import TextHeader from "@/components/common/text-header";

const Community = () => {
  const { query } = useRouter();

  const communityId = query.params?.[0] as string;

  const { data, fetchNextPage, hasNextPage } =
    useCommunityPostsQuery(communityId);

  return (
    <Layout>
      <CommunityProfileHero />
      <div className="bg-primary-0 dark:bg-primary-dark-100 px-5 py-3 rounded-lg mb-5">
        <TextHeader className="pb-3">Post something</TextHeader>
        <hr className="mb-3" />
        <PostInput communityId={communityId} />
      </div>

      <PostList
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
      />
    </Layout>
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
