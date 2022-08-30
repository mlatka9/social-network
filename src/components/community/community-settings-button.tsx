import { useRouter } from "next/router";
import Button from "../common/button";

const CommunitySettingsButton = () => {
  const { push, asPath } = useRouter();

  const openCommuntiSettingsModal = () => {
    push(`${asPath}/settings`, undefined, { shallow: true });
  };

  return <Button onClick={openCommuntiSettingsModal}>Settings</Button>;
};

export default CommunitySettingsButton;
