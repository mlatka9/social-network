import data from "@emoji-mart/data";
// @ts-ignore
import Picker from "@emoji-mart/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";

interface EmojiPickerProps {
  appendEmoji: (emoji: string) => void;
}

const EmojiPicker = ({ appendEmoji }: EmojiPickerProps) => {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleIsPickerOpen = () => setIsPickerOpen(!isPickerOpen);

  const closePicker = () => {
    setIsPickerOpen(false);
  };

  useOnClickOutside(ref, () => closePicker());

  const handleSelectEmoji = (emoji: any) => {
    appendEmoji(emoji.native || "");
  };

  return (
    <div className="relative inline-block mr-1" ref={ref}>
      <button
        className="cursor-pointer self-start h-6 w-6 mr-auto mb-2"
        onClick={toggleIsPickerOpen}
        type="button"
      >
        <Image
          src="/icons/emoji.png"
          width="24"
          height="24"
          alt=""
          className="block"
        />
      </button>
      {isPickerOpen && (
        <div className="absolute top-full z-10 shadow-lg">
          <Picker data={data} theme="light" onEmojiSelect={handleSelectEmoji} />
        </div>
      )}
    </div>
  );
};

export default EmojiPicker;
