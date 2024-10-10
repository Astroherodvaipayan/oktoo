'use client';

import { Button } from '@/components/ui/button';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { ArrowLeft, DeleteIcon } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ClaimButton from './claim-button';

const CreateUserHandle = () => {
  const [selectedEmojis, setSelectedEmojis] = useState<EmojiClickData[]>([]);

  const handleEmojiClick = (emoji: EmojiClickData) => {
    setSelectedEmojis((currEmojis) => {
      // had to implement it here as there was an issue rendering outside here...
      if (currEmojis.length >= 5) {
        return currEmojis;
      }
      return [...currEmojis, emoji];
    });
  };

  const handleDeleteClick = () => {
    setSelectedEmojis((currEmojis) => {
      const newEmojis = [...currEmojis];
      newEmojis.pop();
      return newEmojis;
    });
  };

  return (
    <div
      className="font-sans flex flex-col align-center items-center justify-between overflow-hidden"
      style={{ maxHeight: '100vh', minHeight: '100vh' }}
    >
      <div className="gap-2 md:gap-12 items-center justify-center  pt-14 pb-8 w-full flex flex-row">
        <Link href="/" className="-ml-4 md:-ml-12">
          <Button variant="ghost" className="rounded-full border-white p-2 border">
            <ArrowLeft />
          </Button>
        </Link>
        <div>
          <Link href="/" className="cursor-pointer">
            <div className="flex flex-row items-center gap-2 text-center justify-center">
              <img className="h-6 w-6" src="/logo.webp" />
              <h1 className="text-primary text-2xl text-center font-bold hover:underline">emoji pay</h1>
            </div>
          </Link>
          <h1 className="text-2xl sm:text-4xl md:text-6xl text-center">Create your identity</h1>
          <h1 className="text-lg sm:text-xl md:text-2xl text-zinc-400 text-center">Pick at least 3 emojis</h1>
        </div>
      </div>
      {!!selectedEmojis.length && (
        <div className="py-4">
          <div className="flex flex-wrap">
            {selectedEmojis.map((emoji, index) => (
              <img key={index} className="h-10 w-10 md:h-16 md:w-16 mx-1" src={emoji.imageUrl} />
            ))}
            <Button className="p-0 h-10 w-10 md:h-16 md:w-16" variant="ghost" onClick={handleDeleteClick}>
              <DeleteIcon className="w-6 h-6 md:h-10 md:w-10" />
            </Button>
          </div>
          {selectedEmojis.length >= 3 && (
            <div className="flex flex-row justify-center">
              <div className="justify-center flex mt-2 flex-col text-center">
                <ClaimButton emojis={selectedEmojis.map((item) => item.emoji).join('')} />
              </div>
            </div>
          )}
        </div>
      )}
      <EmojiPicker
        theme={'dark' as any}
        skinTonesDisabled
        autoFocusSearch
        previewConfig={{ showPreview: false }}
        width="100%"
        height={window.innerHeight / 2 ? 500 : window.innerHeight / 2}
        onEmojiClick={handleEmojiClick}
      />
    </div>
  );
};

export default CreateUserHandle;
