import { useEffect, useState, useCallback, useRef } from "react";
import PageAside from "./PageAside";
import SharingMenu from "./SharingMenu";
import FileManager from "./FileManager";
import Editor from "./Editor";
import PageLayout from "../../layout/page/PageLayout";
import EmojiPickerComponent from "../EmojiPicker";
import axiosInstance from "../../services/axios";
import { QueryClient, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from 'lodash/debounce'; // lodash의 debounce 사용
import { useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../store/useUserStore";



export default function NewPage(){
    const { pageId } = useParams();

    const [selectedEmoji, setSelectedEmoji] = useState(null); // 선택한 이모지 상태
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [sharingUsers, setSharingUsers] = useState([]); // 공유 사용자 상태
    const navigate = useNavigate();
    const [title, setTitle] = useState(''); // 제목 상태
    const titleRef = useRef(title);
    const [content, setContent] = useState({ blocks: [] });
    const contentRef = useRef(content);
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    const [isTyping, setIsTyping] = useState(false);
    const typingTimeout = useRef(null); // 타이머 관리
    const contentTimeoutRef = useRef(null); // Timeout for content


    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev); // 현재 상태 반전
      };
  

      // Sync refs with state
    useEffect(() => {
        titleRef.current = title;
    }, [title]);

   

    useEffect(() => {
        contentRef.current = content;
    }, [content]);

    // 저장 핸들러
    const saveContent = useCallback(async () => {
        if (!title || !content) {
            console.error("Missing title or content.");
            return;
        }
        try {
            const fullData = {
                id: pageId,
                title: title,
                content: JSON.stringify(content),
                ownerUid: user.uid,
                permissions: "FULL",
            };
            console.log("Saving content:", fullData);
            await axiosInstance.post("/api/page/save", fullData);
        } catch (error) {
            console.error("Error while saving content:", error);
        }
    }, [title, content, pageId, user]);

    // `debounce`로 저장 함수 최적화
    const debouncedSaveContent = useCallback(debounce(saveContent, 1000), [saveContent]);


    // 타이틀 변경 핸들러
    const handleTitleChange = (e) => {
        const newTitle = e.target.value;
        setTitle(newTitle);
        setIsTyping(true);

        // 입력 완료 후 저장
        clearTimeout(typingTimeout.current); // 이전 타이머 취소
        typingTimeout.current = setTimeout(async () => {
            setIsTyping(false);
            await debouncedSaveContent(); // 저장이 완료되면
            queryClient.invalidateQueries(['pageList']); // 제목 리스트를 갱신
        }, 1000);
    };

    

    // Content change handler with timeout
    const handleContentChange = (updatedContent) => {
        setContent(updatedContent);

        // Clear previous timeout
        clearTimeout(contentTimeoutRef.current);

        // Set a new timeout
        contentTimeoutRef.current = setTimeout(() => {
            debouncedSaveContent(); // Save after timeout
        }, 1000);
    };

    //나중에 해보기  mutate
    // const saveContentMutation = useMutation(
    //     async () => {
    //         const fullData = {
    //             id: pageId,
    //             title: title,
    //             content: JSON.stringify(content),
    //             ownerUid: user.uid,
    //             permissions: "FULL",
    //         };
    //         await axiosInstance.post("/api/page/save", fullData);
    //     },
    //     {
    //         onSuccess: () => {
    //             queryClient.invalidateQueries(['pageList']); // 저장 성공 시 캐시 무효화
    //         },
    //     }
    // );
    
    // // 제목 변경 핸들러 수정
    // const handleTitleChange = (e) => {
    //     const newTitle = e.target.value;
    //     setTitle(newTitle);
    //     setIsTyping(true);
    
    //     clearTimeout(typingTimeout.current);
    
    //     typingTimeout.current = setTimeout(() => {
    //         setIsTyping(false);
    //         saveContentMutation.mutate(); // 저장 실행
    //     }, 1000);
    // };

    // 데이터 가져오기
    const { data: pageDto, isLoading, isError } = useQuery({
        queryKey: ["PageContent", pageId],
        queryFn: async () => {
            const response = await axiosInstance.get(`/api/page/view/${pageId}`);
            return response.data;
        },
        initialData: {
            title: "Untitled",
            content: JSON.stringify({ blocks: [] }),
        },
    });
    useEffect(() => {
        if (pageDto) {
            setTitle(pageDto.title || "Untitled");
            setContent(JSON.parse(pageDto.content || "{}"));
        }
    }, [pageDto]);

   
    // 디바운스된 타이틀 업데이트
    const debouncedSetTitle = useCallback(
        debounce((value) => {
            setTitle(value);
        }, 500), // 0.5초 딜레이
        []
    );

    useEffect(() => {
        if (!isTyping) {
            debouncedSaveContent(); // 타이틀이나 컨텐츠 변경 시 저장
        }
    }, [title, content, isTyping]);
 

    // const handleTitleChange = (e) => {
    //     const newTitle = e.target.value;
    //     e.target.value = newTitle; // 입력 필드 즉시 업데이트
    //     debouncedSetTitle(newTitle); // 디바운스된 상태 업데이트
    // };

    // Create a new page
  const createNewPage = async () => {
    console.log("새로운페이지 생겨야되는데?");
    try {
      const response = await axiosInstance.get("/api/page/newPage");
      if (response.data?.id) {
        navigate(`/page/view/${response.data.id}`);
      }
    } catch (error) {
      console.error("Error creating a new page:", error);
    }
  };


            // Initial data setup
  // 초기 페이지 설정
    useEffect(() => {
        if (!pageId) {
            createNewPage(); // 새 페이지로 이동
        } else {
            queryClient.invalidateQueries(["PageContent", pageId]);
        }
    }, [pageId, navigate, queryClient]);


  // 로딩 중 상태 표시
if (isLoading) {
    return <div>Loading...</div>;
  }
  
  if (isError) {
    return <div>Error loading page content</div>;
  }

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
                                onKeyDown={handleTitleChange} // Use onKeyDown for Enter key handling
                                onChange={handleTitleChange} // Continue using onChange for text updates
                                value={title}
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
                        <Editor title={title} 
                                content={content}  
                                setContent={handleContentChange} // Pass the timeout-based handler
                                onSave={debouncedSaveContent} 
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        e.preventDefault();
                                    }
                                }}
                                pageId={pageId}/>

                    
                    
                  
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