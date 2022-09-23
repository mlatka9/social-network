interface FallbackCardProps {
  children: React.ReactNode;
}

const FallbackCard = ({ children }: FallbackCardProps) => (
  <div className="bg-primary-0 dark:bg-primary-dark-200 p-3 rounded-xl text-primary-500 dark:text-primary-dark-700 flex items-center min-h-[100px] text-lg">
    {children}
  </div>
);

export default FallbackCard;
