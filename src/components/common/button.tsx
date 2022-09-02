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
      'bg-blue-500 hover:bg-blue-400 rounded px-6 py-2 ml-auto self-start text-white font-medium transition-colors',
      isSmall && 'text-xs !px-4 py-1',
      props.disabled && 'bg-blue-300'
    )}
    {...props}
  >
    {children}
  </button>
);

export default Button;
