import clsx from 'clsx';
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isSmall?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  isSmall,
  className,
  children,
  ...props
}) => (
  <button
    type="submit"
    className={clsx(
      className,
      'bg-blue-500 rounded px-6 py-2 font-medium transition-colors text-primary-50',
      isSmall && 'text-xs px-4',
      !props.disabled && 'hover:bg-blue-400',
      props.disabled && 'opacity-60 !hover:bg-blue-400'
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
