import LinkIcon from '../common/icons/link';

interface PostCardLinkProps {
  link: string;
}

const PostCardLink = ({ link }: PostCardLinkProps) => (
  <a
    href={link}
    target="_blank"
    rel="noreferrer"
    className="block m-1"
    onClick={(e) => e.stopPropagation()}
  >
    <div className="italic text-blue-700 dark:text-blue-400 hover:underline flex items-center overflow-hidden">
      <div className="w-4 h-4 shrink-0">
        <LinkIcon
          className="fill-blue-700 dark:fill-blue-400  mr-1"
          width="16"
          height="16"
        />
      </div>
      <span className="md:hidden">
        {link.length > 30 ? link.slice(0, 30).concat('...') : link}
      </span>
      <span className="hidden md:inline-block">
        {link.length > 60 ? link.slice(0, 60).concat('...') : link}
      </span>
    </div>
  </a>
);

export default PostCardLink;
