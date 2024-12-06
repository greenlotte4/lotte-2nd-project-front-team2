import { useEffect, useState, useCallback } from "react";
import PageAside from "./PageAside";
import SharingMenu from "./SharingMenu";
import FileManager from "./FileManager";
import Editor from "./Editor";
import PageLayout from "../../layout/page/PageLayout";
import EmojiPickerComponent from "../EmojiPicker";
import axiosInstance from "../../services/axios";
import { useQuery } from "@tanstack/react-query";
import debounce from 'lodash/debounce'; // lodash의 debounce 사용

export default function NewPage(){

    const [selectedEmoji, setSelectedEmoji] = useState(null); // 선택한 이모지 상태
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [title, setTitle] = useState(''); // 제목 상태
    const [sharingUsers, setSharingUsers] = useState([]); // 공유 사용자 상태
    const [content, setContent] = useState(null);
    const [pageId,setPageId] = useState("");

    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // 현재 상태 반전
      };

       // 저장 핸들러 수정
    const handleSave = () => {
        if (!content) return; // 내용이 없으면 저장하지 않음
        
        try {
            console.log("Saving Content:", content);
            // TODO: 실제 저장 로직 구현
            // 예: API 호출 등
        } catch (error) {
            console.error("Error saving content:", error);
        }
    };

    // 폴더 및 파일 데이터 가져오기
    const { data, isLoading, isError } = useQuery({
        queryKey: ['PageContent', pageId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/api/page/view?id=${pageId}`
            );
        
            return response.data;
        },
        staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
    });

    // 디바운스된 타이틀 업데이트
    const debouncedSetTitle = useCallback(
        debounce((value) => {
            setTitle(value);
        }, 500), // 0.5초 딜레이
        []
    );

    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        e.target.value = newTitle; // 입력 필드 즉시 업데이트
        debouncedSetTitle(newTitle); // 디바운스된 상태 업데이트
    };

    return (<>
         <PageLayout>
                <section className="newPage-main-container w-full h-full bg-white">
                    {/* Title Input Section */}
                     {/* 제목 입력 */}
                        <div className="titleHeader flex">
                        <EmojiPickerComponent
                            selectedEmoji={selectedEmoji}
                            onEmojiSelect={setSelectedEmoji} // 부모에서 상태 관리
                        />
                            <input
                                type="text"
                                placeholder="텍스트 제목 입력"
                                onChange={handleTitleChange}
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
                        <Editor title={title} content={content} setContent={setContent} onSave={handleSave} pageId={pageId} setPageId={setPageId} permissions="FULL"/>
                        <button onClick={handleSave}>Save</button>

                    
                    
                  
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
        </PageLayout>

    
    </>);

}