import React from "react";
import { useToggleCommunityMembershipMutation } from "src/hooks/mutation";
import Button from "../common/button";

interface JoinCommunityButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  joinedByMe: boolean;
  communityId: string;
}
const JoinCommunityButton = ({
  communityId,
  joinedByMe,
  ...buttonProps
}: JoinCommunityButtonProps) => {
  const toggleMembership = useToggleCommunityMembershipMutation();
  const handleToggleCommunity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMembership({ communityId });
  };
  return (
    <Button onClick={handleToggleCommunity} {...buttonProps}>
      {joinedByMe ? "Leave" : "Join"}
    </Button>
  );
};

export default JoinCommunityButton;
