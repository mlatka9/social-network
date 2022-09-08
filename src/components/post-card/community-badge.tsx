/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Link from 'next/link';
import GraphIcon from '../common/icons/graph';

interface CommunityBadgeProps {
  communityId: string;
  communityName: string;
}

const CommunityBadge = ({
  communityId,
  communityName,
}: CommunityBadgeProps) => (
  <Link href={`/community/${communityId}`}>
    <a
      onClick={(e) => e.stopPropagation()}
      className="flex items-center hover:underline w-fit"
    >
      <GraphIcon
        width={16}
        height={16}
        className="fill-primary-400 dark:fill-primary-dark-600"
      />
      <p className="ml-2 font-medium text-sm text-primary-400 dark:text-primary-dark-600 ">
        {communityName}
      </p>
    </a>
  </Link>
);

export default CommunityBadge;
