import React, { useCallback, useRef, useState } from 'react'
import '@/pages/document/Document.scss'
import {CustomSearch} from '@/components/Search'
import { CustomButton } from '../../components/Button';
import { PieChart } from 'recharts';
import PieChartComponent from '../../components/PieChart';
import {DocumentCard1} from '../../components/document/DocumentCard1';
import { DocumentCard2 } from '../../components/document/DocumentCard2';
import MyDropzone from '../../components/DropZone';
import { Modal } from '../../components/Modal';
import { Link, useLocation } from 'react-router-dom';
import DocumentAside from '../../components/document/DocumentAside';
import DocumentLayout from '../../layout/document/DocumentLayout';
import { DocumentCard3 } from '../../components/document/DocumentCard3';
import useUserStore from '../../store/useUserStore';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../../services/axios';
import ContextMenu from '../../components/document/ContextMenu';
import NewFolder from '../../components/document/NewFolder';
import NewDrive from '../../components/document/NewDrive';


export default function Document() {
    const [viewType, setViewType] = useState('box'); // Default to 'box'
    const [isOpen, setIsOpen] = useState(false);
    const [folder, setFolder] = useState(false);
    const [editing, setEditing] = useState(false); // 이름 변경 모드
    const [newFolderName, setNewFolderName] = useState(''); // 새로운 폴더 이름
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // 모달 열림 상태
    const [folderId,setFolderId] =useState("null");
    const queryClient = useQueryClient();
    const [draggedFolder, setDraggedFolder] = useState(null); // 드래그된 폴더
    const [drive, setDrive] = useState(false);
    // const user = useUserStore((state) => state.user);
    // if (!user) return <div>로그인이 필요합니다</div>;

    const [isDetailVisible, setIsDetailVisible] = useState(false); // 상세 정보 표시 상태 추가
    const [selectedFolder, setSelectedFolder] = useState(null); // 선택된 폴더 정보 상태 추가

    const handleDetailToggle = (folder) => {
        console.log("handleDetailToggle",folder)
        setSelectedFolder(folder); // 선택된 폴더 정보 설정
        setIsDetailVisible(!isDetailVisible);
    };

    const closeDetailView = () => {
        setIsDetailVisible(false);
        setSelectedFolder(null);
      };


    const makeDrive = () => {
        setDrive(true)
    }


    const [menuState, setMenuState] = useState({
        isMenuOpen: false,
        position: { top: 0, left: 0 },
        activeFolder: null, // 현재 활성화된 폴더
    });

    const closeMenu = () => {
        setMenuState((prev) => ({ ...prev, isMenuOpen: false, activeFolder: null }));
    };

    const toggleMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setMenuState({
            isMenuOpen: true,
            position: { top: e.clientY, left: e.clientX },
            activeFolder: folder,
        });
    };

    //폴더 zip 다운로드 핸들러
    const fileServerBaseUrl = `http://3.35.170.26:90/download/`;

    const zipDownloadHandler = async (folder) => {
        console.log('Selected folder for zip download:', folder); // Debugging log
        const id = contextMenu.folderId;
        
        try {
            const response = await axiosInstance.get(`/api/drive/generateZip/${id}`);
    
            if (response.status === 200) {
                console.log('zip 파일 생성 성공');
                const zipName = response.data.zipName;
                const downloadUrl = `${fileServerBaseUrl}uploads/zip/${zipName}`;
                const link = document.createElement('a');
                link.href = downloadUrl;
                link.setAttribute('download', folder.name); // 원본 파일명으로 다운로드
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            } else {
                console.error('zip 파일 생성 실패:', response.data);
            }
        } catch (error) {
            console.error('zip 파일 생성 업데이트 중 오류 발생:', error);
        }
    }

    // 폴더 및 파일 데이터 가져오기
    const { data : drives = [], isLoading, isError } = useQuery({
        queryKey: ['folders', folderId],
        queryFn: async () => {
            const response = await axiosInstance.get(
                `/api/drive/folders`
            );
            return response.data;
        },
        staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
    });

    

    // driveList 데이터 가져오기
    // const { data: driveListData, isLoading: isDriveListLoading, isError: isDriveListError } = useQuery({
    //     queryKey: ['driveList'],
    //     queryFn: async () => {
    //         const response = await axiosInstance.get(`/api/drive/folders`);
    //         return response.data;
    //     },
    //     staleTime: 300000, // 데이터가 5분 동안 신선하다고 간주
    // });

    // 폴더 이름 변경 Mutation
    const renameFolderMutation = useMutation({
        mutationFn: async (newName) => {
            if (!newName) throw new Error('Folder name cannot be empty');
            await axiosInstance.put(`/api/drive/folder/${folderId}/rename`, { newName });
        },
        onError: (error) => {
            console.error('Failed to rename folder:', error.message);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(['folderContents', folderId, user.uid]);
            setEditing(false);
        },
    });
    // 파일 업로드 Mutation
    const uploadFileMutation = useMutation({
        mutationFn: async (files) => {
            const formData = new FormData();
            files.forEach((file) => formData.append('files', file));
            await axiosInstance.post(`/api/drive/upload?folderId=${folderId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folderContents', folderId, user.uid] });
        },
    });

    // 이름 변경 핸들러
    const handleRename = () => {
        if (newFolderName.trim() && newFolderName !== location.state?.folderName) {
            renameFolderMutation.mutate(newFolderName);
        }
    };
    // 드래그 시작 핸들러
    const handleDragStart = (folder) => {
        console.log("handelDragStart ",folder)
        setDraggedFolder(folder); // 드래그된 폴더 저장
    }
     
     // 드래그 오버 핸들러 (드롭 가능 영역 활성화)
     const handleDragOver = (e) => {
        e.preventDefault(); // 기본 동작 방지
    };

    // 폴더 이동 Mutation
    const moveFolderMutation = useMutation({
        mutationFn: async ({ folderId, targetFolderId, newOrder }) => {
            const response = await axiosInstance.put(`/api/drive/folder/${folderId}/move`, {
                folderId,
                targetFolderId,
                order: newOrder,
            });
            return response; // Axios response 반환
        },
        onSuccess: (response) => {
             // 서버의 응답 메시지를 확인
        if (response.status === 200) {
            console.log(response.data); // "Folder updated successfully"
            alert("폴더 이동 성공!");
            queryClient.invalidateQueries(['folderContents']);
        } else {
            alert("폴더 이동 실패: " + response.data);
        }
        },
        onError: (error) => {
            console.error('Failed to move folder:', error.message);
            alert('폴더 이동 실패!');
        },
        isLoading: (loading) => {
            // Show loading spinner
        },
    });
    const handleDrop = (targetFolder, position) => {
        console.log("handleDrop called with:", { targetFolder, position });
    
        // 유효성 검사
        if (!targetFolder || !draggedFolder) {
            console.error("Invalid target or dragged folder:", targetFolder, draggedFolder);
            return;
        }
    
        // 자기 자신 위로 드롭하는 경우 무시
        if (draggedFolder.id === targetFolder.id) {
            console.warn("Cannot drop folder onto itself");
            return;
        }
    
        // 타겟 더의 인덱스 찾기
        const targetIndex = subFolders.findIndex((folder) => folder.id === targetFolder.id);
        if (targetIndex === -1) {
            console.error("Target folder not found in subFolders:", targetFolder);
            return;
        }
    
        // 정렬 계산
        let orderBefore = 0;
        let orderAfter = 0;
    
        if (position === "before") {
            // 타겟 폴더 이전의 폴더와 타겟 폴더 사이의 값 계산
            if (targetIndex > 0) {
                orderBefore = subFolders[targetIndex - 1]?.order || 0;
            }
            orderAfter = subFolders[targetIndex]?.order || (orderBefore + 1);
        } else if (position === "after") {
            // 타겟 폴더와 타겟 폴더 이후의 폴더 사이의 값 계산
            orderBefore = subFolders[targetIndex]?.order || 0;
            if (targetIndex < subFolders.length - 1) {
                orderAfter = subFolders[targetIndex + 1]?.order || (orderBefore + 1);
            } else {
                orderAfter = orderBefore + 1; // 마지막 위치로 추가
            }
        }
    
        // 새로운 order 값 계산
        const newOrder = (orderBefore + orderAfter) / 2.0;
    
        console.log("Calculated order values:", { orderBefore, orderAfter, newOrder });
    
        // 폴더 이동 Mutation 호출
        moveFolderMutation.mutate({
            folderId: draggedFolder.id,
            targetFolderId: targetFolder.id,
            newOrder,
        });
    
        // 드래그 상태 초기화
        setDraggedFolder(null);
    };
    
    
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        position: { top: 0, left: 0 },
        folder: null,
    });
    const contextMenuRef = useRef(null); // 메뉴 DOM 참조

    const handleCloseMenu = () => {
        setContextMenu({ visible: false, position: { top: 0, left: 0 }, folder: null });
    };
    
    const handleContextMenu = (e, folder) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        setContextMenu({
            visible: true,
            position: { top: e.clientY, left: e.clientX -400 },
            folder,
            folderId : folder.id,
            folderName: folder.name,
            path: folder.path,
        });
    };

    
    
    

    // 드래그 앤 드롭 업로드 핸들러
    const handleFileDrop = useCallback(
        (event) => {
            event.preventDefault();
            const files = Array.from(event.dataTransfer.files);
            if (files.length === 0) {
                console.error('No files dropped');
                return;
            }
            uploadFileMutation.mutate(files);
        },
        [uploadFileMutation]
    );

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleRename();
        }
    };

  


    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>Error loading data.</div>;

   
    return (
        <DocumentLayout isDetailVisible={isDetailVisible} selectedFolder={selectedFolder} uid={drives.uid} closeDetailView={closeDetailView}>
                <section className='flex gap-4 items-center'>
                    <span className=' text-[24px] ml-4 mt-4'>나의 드라이브 </span>
                </section>
                <section className='mt-3 text-xs opacity-40 w-full flex justify-end'>
                    <p className='mr-4'>last edited : 1 hour ago</p>
                </section>
                <img className='w-full h-1 mt-1' src='/images/document-line.png'></img>
                <section className='flex  justify-between mt-8 mb-6'>
                    <div className='flex gap-4 mx-[20px] w-[98%] items-center'>
                        <CustomSearch
                            width1="20"
                            width2="60"
                        />
                        <p className='ml-4'>View :</p>
                        <button
                            className={`list ${viewType === 'list' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('list')}> 
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} src='/images/document-note.png'
                                  style={{
                                    filter: viewType === 'list' 
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)' 
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필터
                                }}
                            ></img>

                            </button>
                        <button
                            className={`box ${viewType === 'box' ? 'active' : ''}`} // Add active class for styling
                            onClick={() => setViewType('box')}>                       
                            <img className={`list ${viewType === 'list' ? 'active' : ''}`} 
                                 style={{
                                    filter: viewType === 'box'
                                        ? 'invert(29%) sepia(96%) saturate(748%) hue-rotate(180deg) brightness(89%) contrast(101%)'
                                        : 'invert(0%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(0%)', // 블랙 필터
                                }}
                                src='/images/document-menu.png' />
                            </button>
                    </div>
                    <div className='flex gap-2'>
                        <button onClick={makeDrive} className='bg-purple white w-20 h-8 rounded-md text-xs'>드라이브생성</button>
                    </div>
                </section>
                
                {viewType === 'box' ? ( <>
                 <section className='flex gap-6 ml-16 mt-12'>
                 {drives?.folderDtoList?.length > 0 ? (
                        drives.folderDtoList.map((drive) => (
                            <DocumentCard3
                                key={drive.id}
                                cnt={drive.fileCount || 0}
                                fileName={drive.name}
                                onContextMenu={handleContextMenu}
                                onClick={() => setActiveCard(drive.name)}
                                folderId={drive.id}
                                downloadHandler={zipDownloadHandler} // 수정: folder 객체 전달
                                folder={drive}
                                path={drive.path}
                            />
                        ))
                    ) : (
                        <p className="text-gray-500 ml-4">드라이브가 없습니다.</p>
                    )}
                </section>
                    </> ):( 
                        <section  className="h-[500px] overflow-scroll scrollbar-none">
                       <div  className="h-[570px] overflow-scroll scrollbar-none">
                    <table className="docList mx-[20px] w-[98%]">
                    <thead className="h-[48px] bg-[#F2F4F8] sticky top-0 z-10">
                        <tr>
                            <th><input type="checkbox"  /></th>
                            <th>Title</th>
                            <th>Type</th>
                            <th>Size</th>
                            <th>Last Modified</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[...drives].map((item) => (
                             <tr
                                key={folder.id}
                                draggable
                                onDragStart={() => handleDragStart(folder)} // 드래그 시작 핸들러
                                onDragOver={(e) => handleDragOver(e)} // 드래그 오버 핸들러
                                onDrop={(e) => handleDrop(folder, "before")} // 드롭 시 동작 (리스트에서는 기본적으로 "before")
                                className="draggable-row"
                            >
                                <td><input type="checkbox"  /></td>
                                <td>
                                    <Link to={`/document/list/${item.id}`} state={{ folderName: item.name }}>
                                        {item.name}
                                    </Link>
                                </td>
                                <td>{item.type}</td>
                                <td>{item.size || '-'}</td>
                                <td>{item.lastModified || 'Unknown'}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                
                </div>
                <button>선택삭제</button>
                        </section>
                        )
        }
               
                <div className='folder-modal'>
                    <NewDrive 
                        isOpen={drive}
                        onClose={() => setDrive(false)}
                        text="드라이브 만들기"
                    />
                </div>

            <NewFolder isOpen={folder} onClose={() => setFolder(false)} parentId={folderId}     maxOrder={0} // 최대 order 값을 계산해서 전달
            />
             {/* ContextMenu 컴포넌트 */}
             <ContextMenu
                    visible={contextMenu.visible}
                    position={contextMenu.position}
                    onClose={handleCloseMenu}
                    downloadHandler={() => zipDownloadHandler(folder)}
                    folder={contextMenu.folder}
                    folderName={contextMenu.folderName}
                    folderId={contextMenu.folderId}
                    path={contextMenu.path}
                    onDetailToggle={() => handleDetailToggle(contextMenu.folder)} // 상세 정보 토글 함수 전달

                />
               
            </DocumentLayout>
    )
}
