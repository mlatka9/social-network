import React from "react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import { useLockBodyScroll } from "src/hooks/utils";

interface ModalWrapperProps {
  isBig?: boolean;
  title: string;
  children?: React.ReactNode;
  handleCloseModal: () => void;
}

const ModalWrapper = ({
  children,
  title,
  handleCloseModal,
  isBig,
}: ModalWrapperProps) => {
  useLockBodyScroll();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={clsx(
          [
            "fixed p-10 bg-white z-[20]  inset-0 max-w-2xl max-h-[80vh] m-auto rounded-lg",
          ],
          isBig &&
            "max-w-[unset] max-h-[unset] mx-10 mt-10 rounded-2lg inset-0 rounded-b-none"
        )}
      >
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
        <hr className="mt-3 mb-10" />
        <div className="">{children}</div>
      </div>
      <div
        className="bg-neutral-800 opacity-80 fixed inset-0 z-10"
        onClick={handleCloseModal}
      />
    </>,
    document.querySelector("#modal") as HTMLElement
  );
};

export default ModalWrapper;
