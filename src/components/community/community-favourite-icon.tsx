import { useToggleMarkFavouriteCommunityMutation } from 'src/hooks/mutation';
import StarIcon from '../common/icons/star';
import StarEmptyIcon from '../common/icons/star-empty';

interface CommunityFavouriteIconProps {
  communityId: string;
  isMyfavourite: boolean;
}

const CommunityFavouriteIcon = ({
  isMyfavourite,
  communityId,
}: CommunityFavouriteIconProps) => {
  const toggleMarkFavourite = useToggleMarkFavouriteCommunityMutation();

  const handleToggleFavourite = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleMarkFavourite({ communityId });
  };

  return (
    <button
      type="button"
      onClick={handleToggleFavourite}
      className="flex items-center cursor-pointer hover:opacity-80"
    >
      {isMyfavourite ? <StarIcon /> : <StarEmptyIcon />}
    </button>
  );
};

export default CommunityFavouriteIcon;
