import Image from "next/image";

const DeletedCommenFallback = () => {
  return (
    <div className="shadow-sm py-3 mb-3">
      <div className="flex items-center">
        <Image
          src="/images/fallback.svg"
          width="40"
          height="40"
          alt=""
          className="rounded-md"
        />
        <p className="font-medium ml-4">removed</p>
      </div>
    </div>
  );
};

export default DeletedCommenFallback;
