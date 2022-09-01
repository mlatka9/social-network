import { useRouter } from "next/router";
import Link from "next/link";
import clsx from "clsx";

interface PostsSortPanelProps {
  pathname: string;
}

const PostsSortPanel = ({ pathname }: PostsSortPanelProps) => {
  const router = useRouter();

  // `/community/${router.query.params[0]}`

  const sort = router.query.sort as string | undefined;
  const time = router.query.time as string | undefined;

  return (
    <div className="flex">
      <ul className="flex">
        <li>
          <Link
            href={{
              pathname,
            }}
            shallow={true}
          >
            <a className={clsx("text-lg p-3 block", !sort && "font-bold")}>
              Latest
            </a>
          </Link>
        </li>
        <li>
          <Link
            href={{
              pathname,
              query: { sort: "top", time: "day" },
            }}
            shallow={true}
          >
            <a
              className={clsx(
                "text-lg p-3 block",
                sort === "top" && "font-bold"
              )}
            >
              Top
            </a>
          </Link>
        </li>
      </ul>
      {sort === "top" && (
        <ul className="ml-auto flex">
          <Link
            href={{
              pathname,
              query: { sort: "top", time: "day" },
            }}
            shallow={true}
          >
            <a
              className={clsx(
                "text-lg p-3 block",
                time === "day" && "font-bold"
              )}
            >
              Day
            </a>
          </Link>
          <Link
            href={{
              pathname,
              query: { sort: "top", time: "week" },
            }}
            shallow={true}
          >
            <a
              className={clsx(
                "text-lg p-3 block",
                time === "week" && "font-bold"
              )}
            >
              Week
            </a>
          </Link>
        </ul>
      )}
    </div>
  );
};

export default PostsSortPanel;
