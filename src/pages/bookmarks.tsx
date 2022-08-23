import { useUserBookmarkedPostsQuery } from "src/hooks/query";
import Layout from "@/components/common/layout";
import { unstable_getServerSession } from "next-auth";
import { GetServerSidePropsContext } from "next";
import { authOptions } from "./api/auth/[...nextauth]";
import PostList from "@/components/post/post-list";

const Bookmarks = () => {
  const { data, isSuccess, fetchNextPage } = useUserBookmarkedPostsQuery();

  if (!isSuccess) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-neutral-800 text-2xl">Bookmarks</p>
        <p className="text-neutral-600 font-normal">discover</p>
      </h1>
      <PostList data={data} fetchNextPage={fetchNextPage} />
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

export default Bookmarks;
