// src/components/EmojiPicker.tsx
import React from 'react';
import { emojiList } from 'src/data/emojiList';

// props 타입 지정
interface EmojiPickerProps {
  onSelectEmoji: (emoji: string) => void;
}

const EmojiPicker: React.FC<EmojiPickerProps> = ({ onSelectEmoji }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', display: 'flex', flexWrap: 'wrap' }}>
      {emojiList.map((emoji, index) => (
        <span
          key={index}
          onClick={() => onSelectEmoji(emoji)}
          style={{
            cursor: 'pointer',
            fontSize: '24px',
            margin: '5px',
            transition: 'transform 0.2s ease-in-out',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.2)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          {emoji}
        </span>
      ))}
    </div>
  );
};

export default EmojiPicker;
