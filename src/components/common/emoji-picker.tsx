// import data from '@emoji-mart/data';
// @ts-ignore
import Picker from '@emoji-mart/react';
import { useTheme } from 'next-themes';
import { useRef, useState } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import EmojiIcon from './icons/emoji';

interface EmojiPickerProps {
  appendEmoji: (emoji: string) => void;
}

const EmojiPicker = ({ appendEmoji }: EmojiPickerProps) => {
  const { resolvedTheme } = useTheme();
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleIsPickerOpen = () => setIsPickerOpen(!isPickerOpen);

  const closePicker = () => {
    setIsPickerOpen(false);
  };

  useOnClickOutside(ref, () => closePicker());

  const handleSelectEmoji = (emoji: any) => {
    appendEmoji(emoji.native || '');
  };

  return (
    <div className="relative inline-block mr-1 " ref={ref}>
      <button
        className="cursor-pointer self-start h-6 w-6 mr-auto mb-2"
        onClick={toggleIsPickerOpen}
        type="button"
      >
        <EmojiIcon />
      </button>
      {isPickerOpen && (
        <div className="absolute top-full z-10 shadow-lg -translate-x-24 sm:translate-x-0">
          <Picker
            data={async () => {
              const response = await fetch(
                'https://cdn.jsdelivr.net/npm/@emoji-mart/data'
              );

              return response.json();
            }}
            onEmojiSelect={handleSelectEmoji}
            theme={resolvedTheme}
          />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
