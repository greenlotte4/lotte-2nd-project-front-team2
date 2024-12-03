import { useState } from "react";
import DocumentAside from "../../components/document/DocumentAside";
import { useAuthStore } from "../../store/useAuthStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../../services/axios";
import { useLocation } from "react-router-dom";

export default function DocumentLayout({children}){

    const [folders, setFolders] = useState([]); // 폴더 목록 상태
    const [pinnedFolders, setPinnedFolders] = useState([]); // Pinned 폴더
    const [sharedFolders, setSharedFolders] = useState([]); // Shared 폴더
    const queryClient = useQueryClient();
    const location = useLocation(); // 현재 경로 가져오기

   // 폴더 및 파일 데이터 가져오기
   const { data, isLoading, isError } = useQuery({
    queryKey: ['driveList', location.pathname],
    queryFn: async () => {
        const response = await axiosInstance.get(`/api/drive/folders`);
        const allFolders = Array.isArray(response.data) ? response.data : response.data.data;
        const shared = allFolders.filter(folder => folder.isShared === 1);
        const personal = allFolders.filter(folder => folder.isShared === 0);
        setSharedFolders(shared);
        setFolders(personal);
        console.log(Array.isArray(folders)); // true일 경우 배열

        return allFolders;
    },
    onSuccess: (data) =>{
        console.log("Fetched folders:", data);
    },
    staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
});

    return (<>
        <div id='document-container1'>
            <DocumentAside folders={folders} sharedFolders={sharedFolders} allFolders={data}  />
            <section className='document-main1'>
                {children}
            </section>
        </div>
    </>);
}