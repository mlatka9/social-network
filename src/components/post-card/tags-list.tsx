import { Tag } from "@prisma/client";
import Link from "next/link";

interface TagsListProps {
  tags: Tag[];
}

const TagsList = ({ tags }: TagsListProps) => {
  return (
    <div className="flex mt-3 mb-5">
      {tags.map((tag) => (
        <Link key={tag.name} href={`/tag/${tag.name}`}>
          <div
            className="bg-orange-600 text-white rounded-md p-1 mr-2 flex items-center cursor-pointer"
            style={{ backgroundColor: tag.color }}
          >
            <span className="text-sm">#{tag.name}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default TagsList;
