/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import useLockBodyScroll from 'src/hooks/use-lock-body-scroll';
import CloseIcon from '@/components/common/icons/close';

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
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  useLockBodyScroll();

  if (!isMounted) return null;

  return createPortal(
    <div className="z-1 mx-2">
      <div
        aria-label="Close modal"
        className="bg-neutral-800 opacity-80 fixed inset-0 z-10"
        onClick={(e) => {
          e.stopPropagation();
          handleCloseModal();
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          [
            'flex flex-col fixed p-4 pr-0  lg:px-10 lg:pr-0 bg-white z-[10] inset-0 md:mx-auto rounded-lg dark:bg-primary-dark-100',
          ],
          !isBig && 'md:max-w-2xl m-3 md:my-10 ',
          isBig &&
            'md:max-w-[800px] mx-auto mt-3 md:mt-10 inset-0 rounded-b-none'
        )}
      >
        <div className="flex justify-between items-center pr-4 lg:pr-10">
          <div className="font-poppins font-semibold ">{title}</div>
          <button
            type="button"
            className="cursor-pointer flex justify-center items-center"
            onClick={handleCloseModal}
          >
            <CloseIcon />
          </button>
        </div>
        <hr className="mt-3 mb-5 dark:border-primary-700 mr-4 lg:mr-10" />
        <div className="overflow-y-scroll p-[1px] pr-4 lg:pr-10">
          {children}
        </div>
      </div>
    </div>,
    document.querySelector('#modal') as HTMLElement
  );
};

export default ModalWrapper;
