import React, { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "@/components/page/emoji.scss";

const EmojiPickerComponent = ({ selectedEmoji, onEmojiSelect }) => {
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const togglePicker = () => {
    setIsPickerVisible((prev) => !prev);
  };

  const handleEmojiClick = (emojiObject, event) => {
    onEmojiSelect(emojiObject.emoji); // 선택한 이모지를 부모 상태로 전달
    setIsPickerVisible(false); // 이모지 피커 닫기
  };

  return (
    <div className="emoji-picker-container relative z-30">
      <button onClick={togglePicker} className="emoji-btn">
        {selectedEmoji || "😀"}
      </button>
      
      {isPickerVisible && (
        <div className="emoji-picker-popup absolute ">
          <EmojiPicker onEmojiClick={handleEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default EmojiPickerComponent;
