import React from "react";
import { useToggleCommunityMembershipMutation } from "src/hooks/mutation";
import Button from "../common/button";

interface JoinCommunityButtonProps {
  joinedByMe: boolean;
  communityId: string;
}
const JoinCommunityButton = ({
  communityId,
  joinedByMe,
}: JoinCommunityButtonProps) => {
  const toggleMembership = useToggleCommunityMembershipMutation();
  const handleToggleCommunity = (e: React.MouseEvent) => {
    e.preventDefault();
    toggleMembership({ communityId });
  };
  return (
    <Button onClick={handleToggleCommunity}>
      {joinedByMe ? "Leave" : "Join"}
    </Button>
  );
};

export default JoinCommunityButton;
