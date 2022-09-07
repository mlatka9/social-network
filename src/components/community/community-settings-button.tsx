import { useRouter } from 'next/router';
import Button from '../common/button';

const CommunitySettingsButton = () => {
  const router = useRouter();
  const openCommuntiSettingsModal = () => {
    const { section, communityId, ...restParams } = router.query;

    router.replace(
      {
        pathname: `/community/${communityId}`,
        query: { ...restParams, section: 'settings' },
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    );
  };

  return <Button onClick={openCommuntiSettingsModal}>Settings</Button>;
};

export default CommunitySettingsButton;
