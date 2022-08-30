import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";
import { useCommunitiesQuery } from "src/hooks/query";
import { authOptions } from "../api/auth/[...nextauth]";
import CommunityList from "@/components/community/community-list";
import { useState } from "react";
import ModalWrapper from "@/components/common/modal-wrapper";
import CommunityCreator from "@/components/community/community-creator";
import Button from "@/components/common/button";
import Layout from "@/components/common/layout";

const CommunitiesPage = () => {
  const [isCommunityCreatorOpen, setIsCommunityCreatorOpen] = useState(false);

  const handleCloseCreator = () => {
    setIsCommunityCreatorOpen(false);
  };

  const handleOpenCreator = () => {
    setIsCommunityCreatorOpen(true);
  };

  return (
    <Layout>
      <CommunityList />
      {isCommunityCreatorOpen && (
        <ModalWrapper
          handleCloseModal={handleCloseCreator}
          title="Create community"
        >
          <CommunityCreator handleCloseCreator={handleCloseCreator} />
        </ModalWrapper>
      )}
      <Button onClick={handleOpenCreator}>Create community</Button>
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

export default CommunitiesPage;
