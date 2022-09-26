import clsx from 'clsx';

interface LetterCounterProps {
  maxLength: number;
  currentLength: number;
}

const LetterCounter = ({ currentLength, maxLength }: LetterCounterProps) => (
  <div
    className={clsx(
      'absolute right-3 bottom-1 font-medium text-xs text-gray-400 dark:text-primary-dark-600',
      currentLength > maxLength && '!text-red-500'
    )}
  >
    {currentLength} / {maxLength}
  </div>
);

export default LetterCounter;
