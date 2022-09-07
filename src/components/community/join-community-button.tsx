import React from 'react';
import { toast } from 'react-toastify';
import { useToggleCommunityMembershipMutation } from 'src/hooks/mutation';
import Button from '../common/button';

interface JoinCommunityButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  joinedByMe: boolean;
  communityId: string;
  communityName: string;
  isSmall?: boolean;
}
const JoinCommunityButton = ({
  communityId,
  communityName,
  joinedByMe,
  isSmall = false,
  ...buttonProps
}: JoinCommunityButtonProps) => {
  const onSuccessCb = () => {
    if (joinedByMe) {
      toast(`You left community ${communityName}`, {
        type: 'success',
      });
    } else {
      toast(`You joined new community ${communityName}`, {
        type: 'success',
      });
    }
  };
  const toggleMembership = useToggleCommunityMembershipMutation(onSuccessCb);

  const handleToggleCommunity = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleMembership({ communityId });
  };

  return (
    <Button onClick={handleToggleCommunity} {...buttonProps} isSmall={isSmall}>
      {joinedByMe ? 'Leave' : 'Join'}
    </Button>
  );
};

export default JoinCommunityButton;
