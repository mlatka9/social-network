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
    <div className="italic text-blue-700 hover:underline flex items-center">
      <LinkIcon className="fill-blue-700 mr-1" width="15" height="15" />
      {link}
    </div>
  </a>
);

export default PostCardLink;
