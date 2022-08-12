import React from "react";
import Image from "next/image";

interface ModalWrapperProps {
  title: string;
  children?: React.ReactNode;
  handleCloseModal: () => void;
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({
  children,
  title,
  handleCloseModal,
}) => {
  return (
    <>
      <div className="fixed p-10 bg-white z-[200] top-0 inset-0 max-w-2xl max-h-[80vh] m-auto rounded-lg">
        <div className="flex justify-between items-center">
          <div className="font-poppins font-semibold ">{title}</div>
          <button
            className="cursor-pointer flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <Image
              src="/icons/close.png"
              width="20"
              height="20"
              layout="fixed"
              alt="close modal"
            />
          </button>
        </div>
        <hr className="mt-3" />
        {children}
      </div>
      <div
        className="bg-neutral-800 opacity-80 fixed inset-0"
        onClick={handleCloseModal}
      />
    </>
  );
};

export default ModalWrapper;
