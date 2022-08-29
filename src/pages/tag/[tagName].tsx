import type { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth/next";
import { useRouter } from "next/router";
import { authOptions } from "src/pages/api/auth/[...nextauth]";
import { usePostsWithTagQuery } from "src/hooks/query";
import Layout from "@/components/common/layout";
import PostList from "@/components/post/post-list";

const TagPage = () => {
  const { query } = useRouter();

  const tagName = query.tagName as string;
  const { data, fetchNextPage, isSuccess, hasNextPage } =
    usePostsWithTagQuery(tagName);

  if (!isSuccess) return <div>Loading...</div>;

  return (
    <Layout>
      <h1 className="font-poppins mb-10 mt-5 ">
        <p className="font-bold text-primary-800 dark:text-primary-dark-800 text-2xl">
          #{tagName}
        </p>
        <p className="text-neutral-600 dark:text-primary-dark-700 font-normal">
          discover
        </p>
      </h1>
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

export default TagPage;
