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
import GetAddressModal from "../calendar/GetAddressModal";
import ShareMember from "../ShareMember";
import usePageTitleSocket from "../../util/usePageTitleSocket";

export default function NewPage(){
    const [openAddress,setOpenAddress] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [receiveData, setReceiveData] = useState(null);
    const { sendWebSocketMessage, updatePageId, isConnected  } = usePageTitleSocket({ setReceiveData });
    const { pageId } = useParams();
    const [title, setTitle] = useState(null);
    const [isTyping,setIsTyping] = useState(false);
    const userId = useUserStore((state) => state.user?.uid);
    const timerRef = useRef(null)
    const queryClient = useQueryClient();
    const cancleSelectedUsersHandler = (e,user) => {
        setSelectedUsers((prev)=>{
            return prev.filter((selectedUser) => selectedUser.id !== user.id);
        })
    }

    const isKeyDownHandler = (event) => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          setIsTyping(false); // 3초 동안 아무 키도 입력되지 않으면 false로 변경
        }, 1000);
    
        setIsTyping(true); // 키를 입력하면 isTyping을 true로 설정
    };

    useEffect(()=>{
        if(receiveData){
            if(receiveData.title){
                queryClient.invalidateQueries(['pageList'])
                queryClient.invalidateQueries(['page-data',pageId])
            }
            if(Array.isArray(receiveData.selectedUsers)&&receiveData.selectedUsers.length>0){
                queryClient.setQueryData(['page-users',pageId],receiveData.selectedUsers)
            }
        }
        
    },[receiveData])

    useEffect(()=>{
        if(Array.isArray(selectedUsers)&&selectedUsers.length>0&&!isLoadingUsersData&&!isErrorUsersData){
            putUsersMutation.mutate();
        }
    },[selectedUsers])

    const putUsersMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.put(`/api/page/users?pageId=${pageId}`,selectedUsers)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            console.log(data)
            if (isConnected) {
                sendWebSocketMessage(
                {selectedUsers,pageId},
                "/app/page/users"
                );
            }
        },
        onError : (err) => {
            
        }
    })

    const {
        data : usersData,
        isLoading : isLoadingUsersData,
        isError : isErrorUsersData
    } = useQuery({
        queryKey : ['page-users',pageId],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get(`/api/page/users/${pageId}`)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        enabled : !!pageId
    })

    const {
        data : pageTitle ,
        isLoading : isLoadingTitle,
        isError : isErrorTitle
    } = useQuery({
        queryKey : ['page-title',pageId],
        queryFn : async () => {
            try {
                const resp = await axiosInstance.get(`/api/page/title/${pageId}`)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        enabled : !!pageId
    })

    const putTitleMutation = useMutation({
        mutationFn : async () => {
            try {
                const resp = await axiosInstance.put(`/api/page/title?pageId=${pageId}&title=${title}`)
                return resp.data
            } catch (err) {
                return err;
            }
        },
        onSuccess : (data) => {
            if (isConnected) {
                sendWebSocketMessage(
                {
                pageId,
                },
                "/app/page/title"
                );
              }
        },
        onError : (err) => {

        }
    })

    useEffect(()=>{
        if(title!=null&&!isTyping){
            putTitleMutation.mutate();
        }
    },[title,isTyping])

    useEffect(()=>{
        if(pageId===undefined){
            return
        } else if(pageTitle && !isLoadingTitle && !isErrorTitle){
            setTitle(pageTitle)
            updatePageId(pageId)
        }
    },[pageTitle])


    useEffect(()=>{
        if(Array.isArray(usersData)&&usersData.length>0&&!isLoadingUsersData&&!isErrorUsersData){
            setSelectedUsers(usersData)
        }
    },[usersData])
    
    return (<>
         <PageLayout>
                <section className="newPage-main-container w-full h-full bg-white">
                        <div className="titleHeader flex">
                        <EmojiPickerComponent
                        />
                        <input
                            className="title-input"
                            placeholder="이름입력"
                            value={title}
                            onKeyDown={isKeyDownHandler}
                            onChange={(e)=>setTitle(e.target.value)}
                        />
                        <ShareMember 
                        isShareOpen={openAddress}
                        setIsShareOpen={setOpenAddress}
                        members={selectedUsers}
                        >
                            
                        <GetAddressModal 
                            isOpen={openAddress}
                            onClose={()=>setOpenAddress(false)}
                            selectedUsers={selectedUsers}
                            setSelectedUsers={setSelectedUsers}
                            cancleSelectedUsersHandler={cancleSelectedUsersHandler}
                        />
                        </ShareMember>
                        </div>
                        <Editor ></Editor>
                </section>
        </PageLayout>

    
    </>);

}