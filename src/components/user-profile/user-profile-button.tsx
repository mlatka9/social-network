import { useSession } from "next-auth/react";
import ButtonFollow from "@/components/common/button-follow";
import Link from "next/link";
import { useRouter } from "next/router";
import Button from "../common/button";

interface UserProfileButtonProps {
  userId: string;
}
const UserProfileButton = ({ userId }: UserProfileButtonProps) => {
  const { asPath } = useRouter();
  const { data: session } = useSession();
  const currentUser = session?.user!;

  if (userId !== currentUser.id) {
    return <ButtonFollow userId={userId} />;
  }

  return (
    <>
      <Link href={`${asPath}/settings`} shallow={true}>
        <a className="ml-auto">
          <Button>Settings</Button>
        </a>
      </Link>
    </>
  );
};

export default UserProfileButton;
