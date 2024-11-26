import { useEffect, useRef, useState } from "react";
import PageAside from "./PageAside";
import SharingMenu from "./SharingMenu";
import FileManager from "./FileManager";
import Editor from "./Editor";

export default function PageView(){
    const [isEmojiPickerVisible, setIsEmojiPickerVisible] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [title, setTitle] = useState(""); // 제목 상태
    const [sharingUsers, setSharingUsers] = useState([]); // 공유 사용자 상태
    const [content, setContent] = useState(""); // 텍스트 에디터 내용
    const [pageData, setPageData] = useState(null); // 페이지 정보 상태
    const [loading, setLoading] = useState(true); // 로딩 상태
    const [error, setError] = useState(null); // 에러 상태
    const [teamMembers ,setTeamMembers] = useState(null);
    const scrollContainerRef = useRef(null); // 스크롤 컨테이너 참조

   

    const toggleEmojiPicker = () => {
      setIsEmojiPickerVisible((prev) => !prev);
    };

  
    const handleEmojiSelect = (emoji) => {
      console.log(`Selected Emoji: ${emoji}`);
      setIsEmojiPickerVisible(false); // Close picker after selection
    };

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

       // DB에서 페이지 데이터를 가져오는 함수
        useEffect(() => {
            async function fetchPageData() {
            try {
                setLoading(true);
                // const response = await fetch("/api/pages/1"); // 페이지 ID에 따라 API 요청
                // const data = await response.json();
                // setPageData(data); // 페이지 데이터를 상태에 저장
                // setTitle(data.title); // 제목 상태 설정
                // setContent(data.content); // 에디터 내용 설정
                // setSharingUsers(data.sharingUsers || []); // 공유 사용자 상태 설정

                 // 임의 데이터
                const mockData = {
                    id: 1,
                    title: "Sample Page Title",
                    content: "This is some sample content for the editor.",
                    files: ["document1.pdf", "image1.png"],
                    sharingUsers: ["alice@example.com", "bob@example.com"],
                    teamMembers :  [
                        { name: 'Member 1', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 2', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                        { name: 'Member 3', avatar: '/images/dumy-profile.png' },
                      
                    ],
                };
                
                setPageData(mockData); // 페이지 데이터를 상태에 저장
                setTitle(mockData.title); // 제목 상태 설정
                setContent(mockData.content); // 에디터 내용 설정
                setSharingUsers(mockData.sharingUsers); // 공유 사용자 상태 설정
                setTeamMembers(mockData.teamMembers);
            } catch (err) {
                setError("페이지 데이터를 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
            }

            fetchPageData();

              // 초기 스크롤 위치 설정
            if (scrollContainerRef.current) {
                scrollContainerRef.current.scrollLeft = 0;
            }
        }, []);
        
          if (loading) return <div>Loading...</div>;
          if (error) return <div>{error}</div>;

           // 스크롤 이동 함수
        const scrollHorizontally = (direction) => {
            const scrollContainer = scrollContainerRef.current;
            if (scrollContainer) {
            const scrollAmount = 50; // 한 번에 스크롤할 거리
            scrollContainer.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
            }
        };

        const scrollInitialize = ()=>{
            scrollContainerRef.current.scrollLeft = 0;

        }


    return (<>
         <div id="page-container1">
      <PageAside />
      <section className="page-main1">
        <section className="newPage-main-container w-full h-full bg-white">
          {/* Title Input Section */}
          <div className="titleHeader flex">
            <input
              type="text"
              placeholder="텍스트 제목 입력"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="title-input"
            />
            <div className="flex w-[350px] items-center">
                <div className="shareUsers  overflow-scroll scrollbar-none  flex w-[200px]  "
                    ref={scrollContainerRef}
                    onMouseLeave={scrollInitialize} // 마우스가 컨테이너 밖으로 나가면 초기화

                >
                    {teamMembers && teamMembers.length > 0 ? (
                        teamMembers.map((member, index) => (
                            <div className="member-container" key={index}
                            style={{ zIndex: teamMembers.length - index }} // Ensure correct stacking
                            onMouseEnter={() => scrollHorizontally("right")} // 오른쪽으로 스크롤
                            onMouseLeave={() => scrollHorizontally("left")} // 왼쪽으로 스크롤
                            >
                                <img
                                    src={member?.avatar || "/path/to/default-avatar.png"} // Fallback avatar
                                    alt={member?.name || "Unknown Member"} // Fallback name
                                    className="member-avatar"
                                />
                            </div>
                        ))
                    ) : (
                        <p className="no-members">only me</p> // Message when no members exist
                    )}
                </div>
                <img src="/images/star-gray-icon.png" alt="회색별" />
                <button className="shareBtn ml-[20px]" onClick={toggleDropdown}>
                공유하기
                </button>
            </div>
           
          </div>

          {/* 공유 메뉴 */}
          {isDropdownOpen && (
            <SharingMenu
              sharingUsers={sharingUsers}
              setSharingUsers={setSharingUsers}
            />
          )}

          {/* 파일 및 속성 관리 */}
          <FileManager files={pageData?.files || []} />

          {/* 텍스트 에디터 */}
          <Editor content={content} setContent={setContent} />

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
        </section>
      </section>
    </div>
    
    </>);

}