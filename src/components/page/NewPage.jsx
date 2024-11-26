import { useState } from "react";
import PageAside from "./PageAside";
import SharingMenu from "./SharingMenu";
import FileManager from "./FileManager";
import Editor from "./Editor";

export default function NewPage(){
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);

    const toggleEmojiPicker = () => {
      setIsEmojiPickerVisible((prev) => !prev);
    };
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  
    const handleEmojiSelect = (emoji) => {
      console.log(`Selected Emoji: ${emoji}`);
      setIsEmojiPickerVisible(false); // Close picker after selection
    };

    const [title, setTitle] = useState(''); // 제목 상태
    const [sharingUsers, setSharingUsers] = useState([]); // 공유 사용자 상태
    const emojiList = [
        "😀",
        "😁",
        "😂",
        "🤣",
        "😃",
        "😄",
        "😅",
        "😆",
        "😉",
        "😊",
        "😎",
        "😍",
        "😘",
        "🥰",
        "😗",
        "😙",
        "😚",
        "🤗",
      ]; // Example emojis

      const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // 현재 상태 반전
      };


    return (<>
         <div id='page-container1'>
            <PageAside />
            <section className='page-main1 '>
                <section className="newPage-main-container w-full h-full bg-white">
                    {/* Title Input Section */}
                     {/* 제목 입력 */}
                        <div className="titleHeader flex">
                            <input
                                type="text"
                                placeholder="텍스트 제목 입력"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="title-input"
                            />
                            <button className="shareBtn" onClick={toggleDropdown}>공유하기</button>

                        </div>
                       
                         {/* 공유 메뉴 */}
                         {isDropdownOpen &&(
                             <SharingMenu sharingUsers={sharingUsers} setSharingUsers={setSharingUsers} />

                         ) }


                        {/* 파일 및 속성 관리 */}
                        {/* <FileManager /> */}

                        {/* 텍스트 에디터 */}
                         <Editor />

                     {/* Emoji Picker Popup */}
                        {isEmojiPickerVisible && (
                        <>
                            {/* Overlay */}
                            <div
                            className="emoji-overlay"
                            onClick={() => setIsEmojiPickerVisible(false)}
                            ></div>

                            {/* Popup */}
                            <div className="emoji-popup">
                            <input
                                type="text"
                                placeholder="검색"
                                className="emoji-search"
                            />
                            <div className="emoji-list">
                                {emojiList.map((emoji, index) => (
                                <span
                                    key={index}
                                    className="emoji"
                                    onClick={() => handleEmojiSelect(emoji)}
                                >
                                    {emoji}
                                </span>
                                ))}
                            </div>
                            </div>
                        </>
                        )}
                    
                  
                    {/* Dropdown Menu */}
                      {/*   <div className="dropdown-menu">
                            <input
                            type="text"
                            placeholder="새 항목 검색 또는 추가"
                            className="dropdown-input"
                            />
                            <ul className="dropdown-list">
                            <li>텍스트</li>
                            <li>숫자</li>
                            <li>선택</li>
                            <li>파일</li>
                            <li>상태</li>
                            <li>날짜</li>
                            </ul>
                        </div> */}


                </section>
            </section>
        </div>
    
    </>);

}