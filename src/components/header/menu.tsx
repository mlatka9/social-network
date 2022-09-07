import { useRouter } from 'next/router';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import Image from 'next/image';
import { useSession } from 'next-auth/react';
import DropdownMenu from './dropdown-menu';

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
        className="w-10 h-10 rounded-full relative overflow-hidden block"
        onClick={toggleDropDown}
      >
        <Image
          layout="fixed"
          src={me.image || '/images/fallback.svg'}
          alt=""
          objectFit="cover"
          width="40"
          height="40"
        />
      </button>

      {isDropdownShow && <DropdownMenu userId={me.id} />}
    </div>
  );
};

export default Menu;
