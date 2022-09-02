import clsx from 'clsx';

interface TextHeaderProps extends React.HTMLAttributes<HTMLHeadElement> {
  children: React.ReactNode;
}

const TextHeader = ({ children, className, ...props }: TextHeaderProps) => (
  <h2
    className={clsx(
      [
        'font-poppins font-semibold text-primary-800 text-sm dark:text-primary-dark-800',
      ],
      className
    )}
    {...props}
  >
    {children}
  </h2>
);

export default TextHeader;
