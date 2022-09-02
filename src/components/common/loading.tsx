import Spinner from './spinner';

interface LoadingProps {
  height: number;
}

const Loading = ({ height }: LoadingProps) => (
  <div
    className="w-full bg-primary-0 flex justify-center items-center"
    style={{ height }}
  >
    <Spinner />
  </div>
);

export default Loading;
