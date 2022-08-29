import clsx from "clsx";

interface TextHeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  layoutStyle?: "md";
}

const TextHeader: React.FC<TextHeaderProps> = ({
  children,
  layoutStyle = "md",
  className,
  ...props
}) => {
  return (
    <h2
      className={clsx(
        [
          "font-poppins font-semibold text-primary-800 text-sm dark:text-primary-dark-800",
        ],
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export default TextHeader;
