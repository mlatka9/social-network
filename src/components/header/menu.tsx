import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import clsx from 'clsx';
import DropdownMenu from './dropdown-menu';
import CaretDownIcon from '../common/icons/caret-down';

const Menu = () => {
  const router = useRouter();

  const { data: session } = useSession();
  const me = session?.user;

  const [isDropdownShow, setIsDropdownShown] = useState(false);

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

  if (!me) return <div>Loading</div>;

  return (
    <div ref={ref}>
      <button
        type="button"
        className=" relative overflow-hidden flex items-center"
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
          src={me.image || '/images/fallback.svg'}
          alt=""
          objectFit="cover"
          width="40"
          height="40"
          className="rounded-full"
        />
      </button>

      {isDropdownShow && <DropdownMenu userId={me.id} />}
    </div>
  );
};

export default Menu;
