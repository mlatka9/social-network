import { useTheme } from 'next-themes';
import * as React from 'react';
import { SVGProps } from 'react';

const BookmarkIcon = (props: SVGProps<SVGSVGElement>) => {
  const { resolvedTheme } = useTheme();

  return (
    <svg
      width={20}
      height={20}
      fill={resolvedTheme === 'dark' ? 'white' : 'black'}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 384 512"
      {...props}
    >
      <path d="M48 0h288c26.5 0 48 21.49 48 48v439.7c0 13.4-10.9 24.3-24.3 24.3-5 0-9.9-1.5-14-4.4L192 400 38.28 507.6c-4.09 2.9-8.96 4.4-13.95 4.4C10.89 512 0 501.1 0 487.7V48C0 21.49 21.49 0 48 0z" />
    </svg>
  );
};

export default BookmarkIcon;
