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
        ["font-poppins font-semibold text-neutral-700 text-sm dark:text-white"],
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
};

export default TextHeader;
