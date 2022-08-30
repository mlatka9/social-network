import Link from "next/link";
import { SearchUserType } from "@/types/db";

interface MentionsListProps {
  mentions: SearchUserType[];
}

const MentionsList = ({ mentions }: MentionsListProps) => {
  return (
    <div className="flex mt-3 mb-5 space-x-2">
      {mentions.map((mention) => (
        <Link key={mention.id} href={`/user/${mention.id}`}>
          <a onClick={(e) => e.stopPropagation()}>
            <div className=" text-blue-900 rounded-md flex items-center cursor-pointer hover:underline">
              <span className="text-sm">@{mention.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default MentionsList;
