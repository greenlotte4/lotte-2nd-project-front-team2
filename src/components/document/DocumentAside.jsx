import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {CustomSearch} from '@/components/Search'
import { Modal } from "../Modal";
import NewDrive from "./NewDrive";
import useUserStore from "../../store/useUserStore";
import axiosInstance from '@/services/axios.jsx'
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { FaTrash, FaDownload, FaEdit, FaStar, FaShareAlt, FaBarcode } from 'react-icons/fa';
import ContextMenu from "./ContextMenu";
import useStorageStore from "../../store/useStorageStore";



export default function DocumentAside({onStorageInfo}){
   
    // const [folders, setFolders] = useState([]); // 폴더 목록 상태
    const [drive, setDrive] = useState(false);
    const makeDrive = () => {
        setDrive(true)
    }

    const [isPinnedOpen, setIsPinnedOpen] = useState(true); // State to track "My Page" section visibility    
    const [isSharedOpen, setIsSharedOpen] = useState(true);

    const [usedSize, setUsedSize] = useState(0);
    const [remainingSize, setRemainingSize] = useState(0);
    const [usedPercentage, setUsedPercentage] = useState(0);
    
    const [folders, setFolders] = useState([]); // 폴더 목록 상태
    const [pinnedFolders, setPinnedFolders] = useState([]); // Pinned 폴더
    const queryClient = useQueryClient();
    const location = useLocation(); // 현재 경로 가져오기

    const [trashAlert,setTrashAlert] = useState(false);
    const handleCloseTrashAlert = () => setTrashAlert(false);
    const user = useUserStore((state)=>state.user);


  // React Query를 사용하여 폴더 데이터 가져오기
    const { data: folderResponse = { folderDtoList: [],shareFolderDtoList:[], uid: "" }, isLoading, isError } = useQuery({
        queryKey: ["driveList", location.pathname],
        queryFn: async () => {
            const response = await axiosInstance.get("/api/drive/folders");
            return response.data; // 백엔드의 데이터 구조 반환
        },
        staleTime: 300000, // 데이터 신선 유지 시간 (5분)+
    });


    const { data: size , isDataLoading, isDataError } = useQuery({
        queryKey: ["driveSize", user.uid],
        queryFn: async () => {
            const response = await axiosInstance.get("/api/drive/size");
            return response.data; // 백엔드의 데이터 구조 반환
        },
        staleTime: 300000, // 데이터 신선 유지 시간 (5분)+
        onSuccess: (data) => {
            // 데이터 성공적으로 로드 시 스토리지 정보 업데이트
            const sizeInBytes = data.size * 1024;
            const currentUsedSize = sizeInBytes;
            const currentRemainingSize = maxSize - currentUsedSize;
    
            setStorageInfo({
                maxSize,
                currentUsedSize,
                currentRemainingSize,
            });
        },
    });

    console.log("Current user:", user.grade);
    // 폴더 필터링 (공유 및 개인)
    const sharedFolderDtoList = folderResponse?.shareFolderDtoList || [];
    const filteredSharedFolders = sharedFolderDtoList.filter(
        (folder) =>
            !sharedFolderDtoList.some(
                (parent) =>
                    folder.path !== parent.path && folder.path.startsWith(parent.path)
            )
    );

    const personalFolders = folderResponse?.folderDtoList || [];

    const setStorageInfo = useStorageStore((state) => state.setStorageInfo);

 
    const userGrade = user?.grade || 1;    // 기본값 1
    let maxSize = 0;
        if (userGrade === 1 || userGrade  === null) {
            maxSize = 524288000; // 500 MB
        } else if (userGrade  === 2) {
            maxSize = 1048576000; // 1 GB
        } else {
            maxSize = 10485760000; // 10 GB
        }

    useEffect(() => {
          // KB 단위의 size를 Byte로 변환
         const sizeInBytes = size * 1024;
    
        const currentUsedSize = sizeInBytes;
        const currentRemainingSize = maxSize - currentUsedSize;
        const currentUsedPercentage = (currentUsedSize / maxSize) * 100;
    
        setUsedSize(currentUsedSize);
        setRemainingSize(currentRemainingSize);
        setUsedPercentage(currentUsedPercentage);
        setStorageInfo({
            maxSize,
            currentUsedSize,
            currentRemainingSize,
        });

    }, [size]); // `size`와 `userGrade`가 변경될 때 계산
   

    const togglePinnedSection = () => {
      setIsPinnedOpen((prev) => !prev); // Toggle the section
    };
  
    const toggleSharedSection = () => {
        setIsSharedOpen((prev) => !prev);
    }

    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        folder: null,
    });
    const contextMenuRef = useRef(null); // 메뉴 DOM 참조


    const handleContextMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX },
            folder,
            folderId : folder.id,
            isPinned : folder.isPinned,
            folderName: folder.name,
            path: folder.path,

        });
    };
    const handleCloseMenu = () => {
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };


    const handleMenuAction = (action) => {
        console.log(`${action} clicked for folder:`, contextMenu.folder);
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };

    const handleDelete = async (item) => {
        try {
            const response = await axiosInstance.delete(
                `/api/drive/folder/delete/${item.id}`, // 폴더 또는 파일의 타입과 ID 사용
                { params: { path: item.path } } // 경로 전달
            );
    
            if (response.status === 200) {
                console.log(`${item.type} 삭제 성공:`, item.id);
                queryClient.invalidateQueries(['folderContents', folderId]);
                alert(`${item.type === 'folder' ? '폴더' : '파일'}가 삭제되었습니다.`);
            } else {
                console.error('삭제 실패:', response.data);
                alert('삭제에 실패했습니다. 다시 시도해주세요.');
            }
        } catch (error) {
            console.error('삭제 중 오류 발생:', error);
            alert('삭제 중 오류가 발생했습니다.');
        }
    };

   


    const [selectedAction, setSelectedAction] = useState(null);

    const actions = [
        {
            id: 'trash',
            label: '휴지통',
            icon: FaTrash,
            color: 'text-red-500',
        },
        {
            id: 'download',
            label: '다운로드',
            icon: FaDownload,
            color: 'text-blue-500',
        },
        {
            id: 'rename',
            label: '이름 바꾸기',
            icon: FaEdit,
            color: 'text-green-500',
        },
        {
            id: 'favorite',
            label: '즐겨찾기',
            icon: FaStar,
            color: 'text-yellow-500',
        },
        {
            id: 'share',
            label: '드라이브 공유',
            icon: FaShareAlt,
            color: 'text-purple-500',
        },
    ];
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });

    const handleActionClick = (actionId, event) => {
        setSelectedAction(actionId === selectedAction ? null : actionId);
        setMenuPosition({ x: event.clientX, y: event.clientY });
    };

        // 로딩 상태 처리
        if (isLoading || isDataLoading) {
            return <div>Loading data...</div>;
        }
        
        if (isError || isDataError) {
            return <div>Error loading data.</div>;
        }

   
        
    

   



    return(<>
    
    <aside className='document-aside1 overflow-scroll flex flex-col scrollbar-none'>
                <section className='flex justify-center mb-8'><Link to="/document" className='text-lg'>문서 (6)</Link></section>
                <section className='flex justify-center mb-8 w-26'>
                    <select className='outline-none border rounded-l-md opacity-80 h-11 w-24 text-center text-sm'>
                        <option>참여자</option>
                        <option>부장</option>
                        <option>담당업무</option>
                    </select>
                    <CustomSearch
                        width1='24'
                        width2='40'
                    />
                </section>
                <section className="py-[0px] px-[20px] mb-10">
                    <div className='flex gap-4 items-center opacity-60 mb-[10px]'>
                        <img className='w-6 h-6' src='/images/document-star.png'></img>
                        <Link   to={'/document/favorite'}
                                state={{ folderName: "즐겨찾기" }} // folder.name 전달 
                        >
                            <p>즐겨찾기</p>
                        </Link>
                    </div>
                    <div className='flex gap-4 items-center opacity-60 mb-[10px]'>
                        <img  className='w-6 h-6' src='/images/document-recent.png'></img>
                        <Link  to={'/document/latest'}
                                state={{ folderName: "최근문서" }} // folder.name 전달 
                        >
                             <p>최근문서</p>
                        </Link>
                    </div><div className='flex gap-4 items-center opacity-60 mb-[10px]'>
                        <img  className='w-6 h-6' src='/images/trash.png'></img>
                        <Link  to={'/document/trash'}
                                state={{ folderName: "휴지통" }} // folder.name 전달 
                        >
                             <p>휴지통</p>
                        </Link>
                        <img src="/images/setting.png"  className="w-[20px] ml-[90px] cursor-pointer" alt="" 
                            onClick={() => setTrashAlert(true)} // 상태 변경
                            />
                    </div>

                </section>


                <section className='flex justify-between items-center p-4 mb-2'>
                    <div>
                        <p className='text-2xl font-bold'>나의 드라이브 <span className='text-xs font-normal opacity-60'>(  {folders.length})</span></p>
                    </div>
                    <div>
                        <img
                            className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                                isPinnedOpen ? "rotate-0" : "-rotate-90"
                            }`}
                            src="/images/arrow-bot.png"
                            alt="Toggle"
                            onClick={togglePinnedSection}
                            />                    
                    </div>
                </section>


                <section className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                isPinnedOpen ? "max-h-[180px]" : "max-h-0"
                    }`}>
                    {personalFolders.map((folder) => (
                    <div className="flex gap-4 items-center mb-1" key={folder.id} onContextMenu={(e) => handleContextMenu(e, folder)}>
                        <Link   to={`/document/list/${folder.id}`}
                                state={{ folderName: folder.name }} // folder.name 전달
                                className="flex gap-4 items-center mb-1">
                            <img src="/images/document-folder.png" alt="Folder Icon" />
                            <p className="opacity-60 pt-1">{folder.name}</p>
                        </Link>
                    </div>
                    ))}  
                    {personalFolders.length === 0 && <p className="opacity-60"> 폴더가 없습니다.</p>}
                </section>
                <section className='flex justify-between items-center p-4 mb-2 mt-4'>
                    <div>
                        <p className='text-2xl font-bold'>공유 드라이브 <span className='text-xs font-normal opacity-60'>({filteredSharedFolders.length})</span></p>
                    </div>
                    <div>
                    <img
                        className={`cursor-pointer hover:opacity-20 w-[15px] h-[10px] opacity-60 transform transition-transform duration-300 ${
                            isSharedOpen ? "rotate-0" : "-rotate-90"
                        }`}
                        src="/images/arrow-bot.png"
                        alt="Toggle"
                        onClick={toggleSharedSection}
                        />
                    </div>
                </section>
                <section
                        className={`mypageArea flex flex-col px-8  overflow-scroll scrollbar-none transition-all duration-300 ${
                            isSharedOpen ? "max-h-[180px] " : "max-h-0"
                        }`}>
                     {filteredSharedFolders.map((folder) => (
                        <div className="flex gap-4 items-center mb-1" key={folder.id}  onContextMenu={(e) => handleContextMenu(e, folder)}>
                            <Link   to={`/document/list/${folder.id}`}
                                    state={{ folderName: folder.name }} // folder.name 전달
                                    className="flex gap-4 items-center mb-1">
                                <img src="/images/document-folder.png" alt="Folder Icon" />
                                <p className="opacity-60 pt-1">{folder.name}</p>
                            </Link>
                        </div>
                        ))}  
                        {filteredSharedFolders.length === 0 && <p className="opacity-60">Shared 폴더가 없습니다.</p>}
                </section>

                
                <section className='mt-auto flex flex-col gap-5'>
                    <div className="bg-gray-100 rounded-md p-4 text-gray-600 text-sm">
                        <p>사용량: {(usedSize / 1024 / 1024).toFixed(2)} MB / {(maxSize / 1024 / 1024).toFixed(2)} MB</p>
                        <div className="w-full bg-gray-300 rounded-full h-2.5 my-2">
                            <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: `${usedPercentage}%` }}></div>
                        </div>
                        <p>남은 용량: {(remainingSize / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                    <button onClick={makeDrive} className='bg-purple white h-8 rounded-md'>드라이브 생성</button>

                </section>

               {/*  <section className='mt-auto flex flex-col gap-5'>
                    <button onClick={makeDrive} className='bg-purple white h-8 rounded-md'>드라이브 생성</button>
                </section> */}
                <div className='drive-modal'>
                    <NewDrive 
                       order={folderResponse?.folderDtoList?.length}
                       isOpen={drive}
                       onClose={() => setDrive(false)}
                       text="드라이브 만들기"
                    />
                </div>

                {/* ContextMenu 컴포넌트 */}
                <ContextMenu
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseMenu}
                    actions={actions}
                    folder={contextMenu.folder}
                    isPinned={contextMenu.isPinned}
                    folderName={contextMenu.folderName}
                    folderId={contextMenu.folderId}
                                        path={contextMenu.path}

                />
            </aside>
            {trashAlert && (
                <div
                    className="bg-gray-100 rounded-xl shadow-md p-4 absolute z-[999]"
                    style={{
                        top: "50px", // 위치 조정
                        left: "50px", // 위치 조정
                        background: "#fff",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                        padding: "10px",
                        borderRadius: "4px",
                    }}
                >
                    <div className="space-y-4">
                        <div
                            onClick={() => console.log("휴지통 비우기 클릭됨")}
                            className="flex items-center justify-between rounded-lg p-1 cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
                        >
                            <div className="flex items-center space-x-4">
                                <div className={`p-3 rounded-lg bg-opacity-20`}>
                                    <FaBarcode className={`w-5 h-5`} />
                                </div>
                                <span className="font-semibold">휴지통 비우기</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </>)
}