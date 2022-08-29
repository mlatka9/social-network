import Image from "next/image";
import Link from "next/link";
import { User } from "@prisma/client";
import clsx from "clsx";

interface SearchCardProps {
  user: User;
  isSelected: boolean;
}

const SearchCard = ({ user, isSelected }: SearchCardProps) => {
  const trimText = (text: string) => {
    return text.slice(0, 30) + " ...";
  };
  return (
    <Link href={`/user/${user.id}`} key={user.id} passHref>
      <a className="focus:bg-red-300 focus:outline-none block">
        <div
          className={clsx([
            "flex items-center p-3 hover:bg-primary-100 hover:dark:bg-primary-dark-200",
            isSelected && "bg-primary-100 dark:bg-primary-dark-200",
          ])}
        >
          <div className="w-10 h-10 relative mr-2">
            <Image
              src={user.image || "/images/fallback.svg"}
              width="40"
              height="40"
              alt=""
              className="rounded-lg"
              layout="fixed"
            />
          </div>

          <div className="">
            <p className="p-1 block font-medium pb-0">{user.name}</p>
            <p className="p-1 block font-medium text-xs text-gray-400 pt-0">
              {user.bio && trimText(user.bio)}
            </p>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default SearchCard;
