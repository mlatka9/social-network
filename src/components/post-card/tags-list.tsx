import { Tag } from "@prisma/client";
import Link from "next/link";

interface TagsListProps {
  tags: Tag[];
}

const TagsList = ({ tags }: TagsListProps) => {
  return (
    <div className="flex mt-3 mb-5 space-x-2">
      {tags.map((tag) => (
        <Link key={tag.name} href={`/tag/${tag.name}`}>
          <a onClick={(e) => e.stopPropagation()}>
            <div
              className="bg-orange-600 text-white rounded-md p-1  flex items-center cursor-pointer"
              style={{ backgroundColor: tag.color }}
            >
              <span className="text-sm">#{tag.name}</span>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
};

export default TagsList;
