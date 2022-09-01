import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      type="submit"
      className={clsx(
        className,
        "bg-blue-500 hover:bg-blue-400 rounded px-6 py-2 ml-auto self-start text-white font-medium transition-colors",

        props.disabled && "bg-blue-300"
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
