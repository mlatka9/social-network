interface TextHeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  layoutStyle?: "md";
}

const TextHeader: React.FC<TextHeaderProps> = ({
  children,
  layoutStyle = "md",
  ...props
}) => {
  return (
    <h2
      className="font-poppins font-semibold text-neutral-700 text-sm"
      {...props}
    >
      {children}
    </h2>
  );
};

export default TextHeader;
