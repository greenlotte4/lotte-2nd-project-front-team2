import { useEffect, useState, useCallback, useRef } from "react";
import PageAside from "./PageAside";
import SharingMenu from "./SharingMenu";
import FileManager from "./FileManager";
import Editor from "./Editor";
import PageLayout from "../../layout/page/PageLayout";
import EmojiPickerComponent from "../EmojiPicker";
import axiosInstance from "../../services/axios";
import { QueryClient, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from 'lodash/debounce'; // lodash의 debounce 사용
import { useLocation, useNavigate, useParams } from "react-router-dom";
import useUserStore from "../../store/useUserStore";
import usePageSocket from "../../util/usePageSocket";



export default function NewPage(){
    const { pageId } = useParams();
    const [title, setTitle] = useState(null); // 제목 상태
    const [selectId, setSelectId] = useState();
    const [content, setContent] = useState({ blocks: [] });
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const [userId, setUserId] = useState()
    const timerRef = useRef(null);
    // const [isType, setIsKeyDown] = useState(false);

    const [selectedEmoji, setSelectedEmoji] = useState(null); // 선택한 이모지 상태
    const [sharingUsers, setSharingUsers] = useState([]); // 공유 사용자 상태
    const navigate = useNavigate();
    const titleRef = useRef(title);
    const contentRef = useRef(content);
    const queryClient = useQueryClient();
    const user = useUserStore((state) => state.user);
    
    const typingTimeout = useRef(null); // 타이머 관리
    const contentTimeoutRef = useRef(null); // Timeout for content

    const putPageContent = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.put("/api/page/content",{
                    title : title,
                    id : selectId
                })
                return resp.data
            } catch (err) {
                return err
            }
        },
        onSuccess : (data) => {
          queryClient.invalidateQueries(['page-content'])
        },
        onError : (err) => {
    
        }
    })

    useEffect(()=>{
        if(title!=null&&!isTyping){
            putPageContent.mutate();
        }
    },[title,isTyping])

    const isKeyDownHandler = (event) => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setIsTyping(false); // 3초 동안 아무 키도 입력되지 않으면 false로 변경
        }, 1000);
    
        setIsTyping(true); // 키를 입력하면 isTyping을 true로 설정
      };

    const {
        data : pageContentData,
        isLoading : isLoadingContent,
        isError : isErrorContent
    } = useQuery({
        queryKey : ['page-content',selectId],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get(`/api/page/content?pageId=${selectId}`)
                console.log(resp.data)
                return resp.data
            } catch (err) {
                return resp
            }
        },
        enabled : !!selectId,
        retry : false,
        cacheTime : 6 * 60 * 1000
    })

    useEffect(()=>{
        if(pageId != null){
            setSelectId(pageId)
            updatePageId(pageId)
            setUserId(user.id)
        }
    },[pageId])

    useEffect(()=>{
        if(!isLoadingContent&&!isErrorContent&&(typeof pageContentData === 'object' && pageContentData !== null)){
            const jsonData = JSON.parse(pageContentData.content);
            setTitle(pageContentData.title)
            setContent(jsonData)
        }
    },[isLoadingContent,isErrorContent,pageContentData])

    const { stompClient, isConnected, receiveMessage , updatePageId } = usePageSocket({});

    useEffect(()=>{
        if(receiveMessage){
            if(user.id != receiveMessage.userId){
                queryClient.invalidateQueries(['page-content'])
            }   
        }
    },[receiveMessage])

    return (<>
         <PageLayout>
                <section className="newPage-main-container w-full h-full bg-white">
                    {/* Title Input Section */}
                     {/* 제목 입력 */}
                        <div className="titleHeader flex">
                        <EmojiPickerComponent
                            selectedEmoji={null}
                            onEmojiSelect={null} // 부모에서 상태 관리
                        />
                        {isLoadingContent ? (<p>로딩중...</p>) : isErrorContent ? (<p>에러...</p>) :
                        (typeof pageContentData === 'object' && pageContentData !== null ) ?
                        (
                            <input
                            type="text"
                            placeholder="텍스트 제목 입력"
                            // onKeyDown={null} // Use onKeyDown for Enter key handling
                            onKeyDown={isKeyDownHandler}
                            onChange={(e)=>setTitle(e.target.value)} // Continue using onChange for text updates
                            value={title}
                            className="title-input"
                        />
                        ) : (<p>ㅇㅇㅇ..</p>)}
                           
                            <button className="shareBtn" onClick={()=>setIsDropdownOpen(true)}>공유하기</button>

                        </div>
                        

                        {/* 파일 및 속성 관리 */}
                        {/* <FileManager /> */}

                        {/* 텍스트 에디터 */}
                        {isLoadingContent ? (<p>로딩중...</p>) : isErrorContent ? (<p>에러...</p>) :
                        (typeof pageContentData === 'object' && pageContentData !== null ) ?
                        (
                        <Editor 
                        title={title}
                        content={JSON.parse(pageContentData.content)}
                        setContent={setContent} // Pass the timeout-based handler
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                        pageId={pageId}
                        selectId={selectId}
                        userId={userId}
                        />
                        ) : (<p>ㅇㅇㅇ..</p>)
                        }
                        
                        

                    
                    
                  
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