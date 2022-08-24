import { useSession } from "next-auth/react";
import ButtonFollow from "@/components/common/button-follow";
import Link from "next/link";
import { useRouter } from "next/router";

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
          <div className="bg-slate-800 text-white self-start py-2 px-4 rounded-lg cursor-pointer hover:bg-slate-700 transition-colors">
            Settings
          </div>
        </a>
      </Link>
    </>
  );
};

export default UserProfileButton;
