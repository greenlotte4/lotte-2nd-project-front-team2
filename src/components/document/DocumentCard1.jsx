import React, { useEffect, useRef, useState } from 'react';
import '@/components/document/DocumentCard1.scss';
import { Link, useNavigate } from 'react-router-dom';
import RenameModal from './ChangeName';
import CustomAlert from './CustomAlert';
import axiosInstance from '../../services/axios';
import { useQueryClient } from '@tanstack/react-query';
import { MenuToggle } from './MenuToggle';
import ContextMenu from './ContextMenu';

export const DocumentCard1 = ({
    cnt,
    folderName,
    setSelectedFolder,
    folderId,
    folder,
    path,
    onDragStart, 
    onDragOver, 
    onDrop,
    updatedAt,
    onContextMenu,
    downloadHandler,
    togglePin,
    isFavorite,
    setIsFavorite,
    handleDelete,
    type

}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리
    // const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client

    const navigate = useNavigate();
    const menuRef = useRef(null); // 메뉴 DOM 참조
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(folderName); // 폴더 이름 상태
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // 메뉴 위치

    const [alert, setAlert] = useState(null); // 알림 상태 관리


    const handleFavoriteToggle = async () => {
        const newFavoriteState = !isFavorite; // 새로운 상태
        setIsFavorite(newFavoriteState); // UI 업데이트
    
        try {
            const response = await axiosInstance.put(`/api/drive/folder/${folderId}/favorite`, {
                isPinned: newFavoriteState ? 1 : 0, // 백엔드에 맞는 값으로 변환하여 전송
            });
    
            if (response.status === 200) {
                console.log('즐겨찾기 상태 업데이트 성공');
                if(response.data.result === 1){
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 성공',
                        message: `폴더 "${folderName}"가 즐겨찾기에 추가되었습니다.`,
                        onConfirm: () => setAlert(null), // 알림 닫기
                    });
                    queryClient.invalidateQueries(['favorite'])
                }else{
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 해제성공',
                        message: `폴더 "${folderName}"가 즐겨찾기 해제되었습니다.`,
                        onConfirm: () => setAlert(null), // 알림 닫기
                    });
                    queryClient.invalidateQueries(['favorite'])

                }
                
            } else {
                console.error('즐겨찾기 상태 업데이트 실패:', response.data);
                setAlert({
                    type: 'error',
                    title: '즐겨찾기 실패',
                    message: '즐겨찾기 상태를 업데이트하지 못했습니다. 다시 시도해주세요.',
                    onConfirm: () => setAlert(null),
                });
                setIsFavorite(!newFavoriteState); // 실패 시 상태 원복
            }
        } catch (error) {
            console.error('즐겨찾기 상태 업데이트 중 오류 발생:', error);
            setAlert({
                type: 'error',
                title: '오류 발생',
                message: '즐겨찾기 상태를 업데이트하는 중 오류가 발생했습니다.',
                onConfirm: () => setAlert(null),
            });
            setIsFavorite(!newFavoriteState); // 실패 시 상태 원복
        }
    };

    const toggleMenu = (e) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
        console.log('Folder for context menu:', folder); // 디버깅용
        setSelectedFolder(folder); // Set the selected folder

        setMenuPosition({ top: e.clientY, left: e.clientX }); // 클릭 위치 기반으로 위치 설정
        setIsMenuOpen(true); // 메뉴 열기
    };
    const openRenameModal = () => {
        setIsRenameModalOpen(true);
        setIsMenuOpen(false); // 메뉴 닫기
    };

    const closeRenameModal = () => {
        setIsRenameModalOpen(false);
    };

    const handleRename = (newName) => {
        console.log('Renaming folder to:', newName);
        setNewName(newName);
        setIsRenameModalOpen(false);
        // 실제 이름 변경 로직
    };

    const navigateHandler = () =>{
        if (type !== 'trash') {
            navigate(`/document/list/${folderId}`,{
                state: {
                    cnt,
                    folderName,
                    folderId,
                    updatedAt,
                }
            });
        }
    
    }


     // 메뉴 바깥 클릭 시 닫기
   /*   useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []); */

    // const handleDelete = () => {
    //     console.log('Delete folder:', folderId);
    //     setIsAlertOpen(true); // CustomAlert 열기

    //     // 폴더 삭제 로직
    // };

    // const handleConfirm = async() => {
    //     console.log('Deleting folder:', folderId);
    //     setIsAlertOpen(false); // CustomAlert 닫기
    
    //     // 폴더 삭제 로직
    //     try {
    //         // 실제 삭제 API 호출
    //        const response =  await axiosInstance.delete(`/api/drive/folder/delete/${folderId}`,
    //         { params: { path } } // 쿼리 매개변수로 path 전달
    //        );
    //        if (response.status === 200) {
    //         queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
    //         alert('휴지통으로 이동  성공');
    //       } else {
    //         console.error('삭제 실패:', error);
    //         alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
    //       }
    //     } catch (error) {
    //         console.error('폴더 삭제 중 오류 발생:', error);

    //     }
    //             /* .then((response) => {
    //                 if (response.status === 200) {
    //                     alert('폴더가 삭제되었습니다.');
    //                     // QueryClient로 폴더 목록 업데이트
    //                     queryClient.invalidateQueries(['folderContents']);
    //                 }
    //             })
    //             .catch((error) => {
    //                 console.error('삭제 실패:', error);
    //                 alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
    //             });
    //     } catch (error) {
    //         console.error('폴더 삭제 중 오류 발생:', error);
    //     } */
    // };
    
    // const handleCancel = () => {
    //     setIsAlertOpen(false); // CustomAlert 닫기
    // };

    const handleShare = () => {
        console.log('Share folder:', folderId);
        // 폴더 공유 로직
    };
    

    return (
        <div className="document-card1 flex flex-row items-center z-1"  draggable
                    onContextMenu={(e) => onContextMenu(e, folder)} // Trigger the context menu

                    onDragStart={(e) => {
                        e.stopPropagation(); // Prevent event propagation
                        onDragStart(folder); // Call the passed onDragStart function
                    }}                 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(folder)}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        margin: '5px',
                        cursor: 'grab',
                        position: 'relative', // Ensure this is relative for child absolute positioning
                    }}
                    onClick={() => setSelectedFolder(folder)} // 폴더 선택

        >
               
            <div className=" flex flex-row mr-[20px]">
            <button>
                <img className=" w-[50px] h-[60px]" src="/images/document-open-folder.png" />
            </button>
            </div>

            <div className="flex-row mr-[20px] w-[50px]">
                    <p className="text-xs" onClick={(e)=> { e.preventDefault; navigateHandler()}}>{cnt} files</p>
            </div>
            <div className="flex-row mt-2 w-[200px]">

                <p className="w-1/2 text-center text-blue-900 text-sm" onClick={(e)=> { e.preventDefault; navigateHandler()}}>{folderName}</p>
            </div>
            <img
                    className="absolute cursor-pointer right-[20px] w-[25px] "
                    src={isFavorite ? '/images/star_on.png' : '/images/star_off.png'} // 상태에 따라 이미지 변경                    
                    alt="즐겨찾기"
                    onClick={(e) => {
                        e.stopPropagation(); // 클릭 이벤트 전파 방지
                        handleFavoriteToggle();
                    }}
                />
            {isMenuOpen && (
                 <ContextMenu
                    type={"folder"}
                    visible={true}
                    position={menuPosition}
                    folder={folder}
                    name={folderName}
                    Id={folderId}
                    path={path}
                    downloadHandler={(folderId) => downloadHandler(folderId)} // Pass selectedFolder
                    // handleDelete={handleDelete}
                    />
            )}

            {alert && (
            <CustomAlert
                type={alert.type}
                title={alert.title}
                message={alert.message}
                confirmText="확인"
                onConfirm={alert.onConfirm}
            />
             )}
                       


        </div>
    );
};
