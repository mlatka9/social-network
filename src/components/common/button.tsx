import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
const Button: React.FC<ButtonProps> = (props) => {
  return (
    <button
      type="submit"
      className="bg-blue-500 rounded px-6 py-2 ml-auto self-start text-white"
      {...props}
    >
      {props.children}
    </button>
  );
};

export default Button;
