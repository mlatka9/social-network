import PostCard from "@/components/post-card";
import { trpc } from "src/utils/trpc";

const Bookmarks = () => {
  const utils = trpc.useContext();
  const { data, isSuccess } = trpc.useQuery(["bookmarks.getAll"]);

  if (!isSuccess) {
    return <div>loading...</div>;
  }

  return (
    <div>
      {data.map((bookmark) => (
        <PostCard key={bookmark.id} post={bookmark} />
      ))}
    </div>
  );
};

export default Bookmarks;
