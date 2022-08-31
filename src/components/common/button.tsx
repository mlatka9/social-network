import clsx from "clsx";
import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<ButtonProps> = ({ className, children, ...props }) => {
  return (
    <button
      type="submit"
      className={clsx(
        "bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white",
        props.disabled && "bg-blue-300",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
