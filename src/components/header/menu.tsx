import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import { useNotificationsCountQuery } from '@/hooks/query';
import DropdownMenu from './dropdown-menu';
import CaretDownIcon from '../common/icons/caret-down';

const Menu = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const me = session?.user!;

  const [isDropdownShow, setIsDropdownShown] = useState(false);
  const { data: notificationCount } = useNotificationsCountQuery();

  const ref = useRef(null);

  const hideDropdown = useCallback(() => {
    setIsDropdownShown(false);
  }, []);

  useEffect(() => {
    hideDropdown();
  }, [router.asPath, hideDropdown]);

  useOnClickOutside(ref, () => hideDropdown());

  const toggleDropDown = () => {
    setIsDropdownShown(!isDropdownShow);
  };

  const closeDropDown = () => {
    setIsDropdownShown(false);
  };

  return (
    <div ref={ref}>
      <button
        type="button"
        className=" relative flex items-center"
        onClick={toggleDropDown}
      >
        <div
          className={clsx(
            'transition-transform duration-200 mr-1',
            isDropdownShow && 'rotate-180'
          )}
        >
          <CaretDownIcon />
        </div>
        <Image
          layout="fixed"
          src={me.image || '/images/avatar-fallback.svg'}
          alt=""
          objectFit="cover"
          width="40"
          height="40"
          className="rounded-full"
        />
        {!!notificationCount && (
          <div>
            <div className="animate-ping w-3 h-3 bg-red-500 absolute rounded-full right-0 top-0" />
            <div className="w-3 h-3 bg-red-500 absolute rounded-full right-0 top-0" />
          </div>
        )}
      </button>

      {isDropdownShow && (
        <DropdownMenu
          userId={me.id}
          closeDropDown={closeDropDown}
          notificationCount={notificationCount}
        />
      )}
    </div>
  );
};

export default Menu;
