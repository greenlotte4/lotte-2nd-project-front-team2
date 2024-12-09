import React, { useEffect, useRef, useState } from "react";
import { FaTrash, FaDownload, FaEdit, FaStar, FaShareAlt, FaInfo, FaTrashRestore } from 'react-icons/fa';
import RenameModal from "./ChangeName";
import axiosInstance from "../../services/axios";
import { useQueryClient } from "@tanstack/react-query";
import CustomAlert from "./CustomAlert";


export default function ContextMenu({
    visible,
    position,
    onClose,
    folder,
    folderId,
    isPinned,
    folderName,
    path,
    onDetailToggle,
    downloadHandler,
    type,
}) {
    const contextMenuRef = useRef(null);
    const renameModalRef = useRef(null); // RenameModal의 레퍼런스
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(folderName); // 폴더 이름 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client

    const [isFavorite, setIsFavorite] = useState(Boolean(isPinned));
    const [alert,setAlert] = useState();
    const handleFavoriteToggle = async () => {
        const newFavoriteState = !isFavorite;
        setIsFavorite(newFavoriteState);

        try {
            const response = await axiosInstance.put(`/api/drive/folder/${folderId}/favorite`, {
                isPinned: newFavoriteState ? 1 : 0,
            });

            if (response.status === 200) {
                if (response.data.result === 1) {
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 성공',
                        message: `"${folderName}" 폴더가 즐겨찾기에 추가되었습니다.`,
                        onConfirm: () => setAlert(null),
                    });
                } else {
                    setAlert({
                        type: 'success',
                        title: '즐겨찾기 해제',
                        message: `"${folderName}" 폴더가 즐겨찾기에서 제거되었습니다.`,
                        onConfirm: () => setAlert(null),
                    });
                }
                queryClient.invalidateQueries(['folderContents']);
            } else {
                throw new Error('즐겨찾기 업데이트 실패');
            }
        } catch (error) {
            setIsFavorite(!newFavoriteState);
            setAlert({
                type: 'error',
                title: '오류 발생',
                message: '즐겨찾기 상태를 업데이트하는 중 오류가 발생했습니다.',
                onConfirm: () => setAlert(null),
            });
        }
    };


    const handelRestore = (folder) =>{

    }

  


    const actions = type === 'trash' ? [
        {
            id: 'restore',
            label: '복구하기',
            icon: FaTrashRestore,
            color: 'text-red-500',
            onClick : () => {
                setIsRestoreAlert(true); // 상위 컴포넌트의 handleDelete 함수 호출
            },
        },
        {
            id: 'permanentDelete',
            label: '영구 삭제',
            icon: FaTrash,
            color: 'text-red-500',
            onClick: () => setIsDeletedAlert(true),
        },
    ]:  [
        {
            id: 'trash',
            label: '휴지통',
            icon: FaTrash,
            color: 'text-red-500',
            onClick : () => {
                setIsAlertOpen(true); // 상위 컴포넌트의 handleDelete 함수 호출
            },
        },
        {
            id: 'download',
            label: '다운로드',
            icon: FaDownload,
            color: 'text-blue-500',
            onClick: () => downloadHandler(folder),
        },
        {
            id: 'rename',
            label: '이름 바꾸기',
            icon: FaEdit,
            color: 'text-green-500',
            onClick:  () => openRenameModal(), // 함수 참조 전달
        },
        {
            id: 'favorite',
            label: '즐겨찾기 추가',
            icon: FaStar,
            color: 'text-yellow-500',
            onClick: () => handleFavoriteToggle(),
        },
        {
            id: 'share',
            label: '공유',
            icon: FaShareAlt,
            color: 'text-purple-500',
            onClick: (folder) => console.log(`공유: ${folder.name}`),
        },
        {
            id: 'info',
            label: '상세정보',
            icon: FaInfo,
            color: 'text-purple-500',
            onClick: () => {
                console.log(`상세정보: ${folder.name}`);
                onDetailToggle();
            },
        },
    ];

    const openRenameModal = (folder) => {
        setIsRenameModalOpen(true); // RenameModal 열기
    };

    const closeRenameModal = () => {
        setIsRenameModalOpen(false);
    };

    const handleRename = (newName) => {
        console.log("Renaming folder to:", newName);
        setIsRenameModalOpen(false);
        onClose(); // Close the ContextMenu when RenameModal closes
        queryClient.invalidateQueries(["folderContents"]);
    };

    const handleDelete = () => {
        console.log('Delete folder:', folderId);
        setIsAlertOpen(true); // CustomAlert 열기

        // 폴더 삭제 로직
    };

    const handleConfirm = async() => {
        console.log('Deleting folder:', folderId);
        setIsAlertOpen(false); // CustomAlert 닫기
    
        // 폴더 삭제 로직
        try {
            // 실제 삭제 API 호출
           const response =  await axiosInstance.delete(`/api/drive/folder/delete/${folderId}`,
            { params: { path } } // 쿼리 매개변수로 path 전달
           );
           if (response.status === 200) {
            queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
            alert('휴지통으로 이동  성공');
          } else {
            console.error('삭제 실패:', error);
            alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (error) {
            console.error('폴더 삭제 중 오류 발생:', error);

        }
    };

    const closeMenu = () => {
        setMenuState({ visible: false, position: { top: 0, left: 0 }, activeFolder: null });
    };
    

    const [isRestoreAlert,setIsRestoreAlert] = useState(false);;

    const handleRestoreConfirm =  async() => {
        console.log('Restore folder:', folderId);
        setIsAlertOpen(false); // CustomAlert 닫기
    
        // 폴더 복구 로직
        try {
            // 실제 복구 API 호출
           const response =  await axiosInstance.delete(`/api/drive/folder/restore/${folderId}`
           );
           if (response.status === 200) {

                if(response.data){
                    queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
                    queryClient.invalidateQueries(['trash']); // Replace with the relevant query key
                    alert('복구 성공');
                }else{
                    alert('복구실패');
                }

           
          } else {
            console.error('복구 실패:', error);
            alert('폴더 복구에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (error) {
            console.error('폴더 복구 중 오류 발생:', error);

        }
    };

    //폴더 영구삭제
    const [isDeletedAlert,setIsDeletedAlert] = useState(false);;
    const handleDeleted = ()=>{
        
        setIsDeletedAlert(true);
    }

    const handleDeleteConfirm = async() => {
        console.log('Deleting folder:', folderId);
        setIsAlertOpen(false); // CustomAlert 닫기
    
        // 폴더 영구삭제 로직
        try {
            // 영구삭제 API 호출
           const response =  await axiosInstance.delete(`/api/drive/folder/permanent/${folderId}`
           );
           if (response.status === 200) {
            queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
            alert('삭제 성공');
          } else {
            console.error('삭제 실패:', error);
            alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
          }
        } catch (error) {
            console.error('폴더 삭제 중 오류 발생:', error);

        }
    };

   
    
    
    const handleCancel = () => {
        setIsAlertOpen(false); // CustomAlert 닫기
        setIsRestoreAlert(false);
    };

    const handleShare = () => {
        console.log('Share folder:', folderId);
        // 폴더 공유 로직
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the RenameModal is open, handle clicks outside both the ContextMenu and RenameModal
        if (isRenameModalOpen) {
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target) &&
                renameModalRef.current &&
                !renameModalRef.current.contains(event.target)
            ) {
                onClose();
                setIsRenameModalOpen(false);
                setIsRestoreAlert(false); // CustomAlert 닫기
                setIsDeletedAlert(false);
            }
        } else {
            // If the RenameModal is not open, only check clicks outside the ContextMenu
            if (
                contextMenuRef.current &&
                !contextMenuRef.current.contains(event.target)
            ) {
                
                setIsDeletedAlert(false);
                setIsRestoreAlert(false); // CustomAlert 닫기
                onClose();
            }
        }
        };
    
        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [onClose,isRenameModalOpen]);
    
    if (!visible) return null;

   
    

    return (
        <>
        <div
            ref={contextMenuRef}
            className="bg-gray-100 rounded-xl shadow-md p-4 absolute z-10"
            style={{
                top: position.top,
                left: position.left,
                background: "#fff",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                padding: "10px",
                borderRadius: "4px",
            }}
        >
            <div className="space-y-4">
                {actions.map((action) => (
                    <div
                        key={action.id}
                        onClick={() => action.onClick(folder)}
                        className="flex items-center justify-between rounded-lg p-1 cursor-pointer transition-all duration-300 hover:bg-gray-200 hover:shadow-lg"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`p-3 rounded-lg ${action.color} bg-opacity-20`}>
                                <action.icon className={`w-5 h-5 ${action.color}`} />
                            </div>
                            <span className="font-semibold">{action.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        {alert && (
                    <CustomAlert
                        type={alert.type}
                        title={alert.title}
                        message={alert.message}
                        confirmText="확인"
                        onConfirm={alert.onConfirm}
                    />
                    )}

        {isAlertOpen  && (
                                
                <CustomAlert
                    type="warning" // success, error, warning, info 중 선택
                    title="확인"
                    message="폴더를 삭제하시겠습니까?"
                    subMessage="해당 폴더 삭제시 폴더 안의 파일 까지 삭제됩니다."
                    onConfirm={handleConfirm} // 확인 버튼 클릭 핸들러
                    onCancel={handleCancel} // 취소 버튼 클릭 핸들러
                    confirmText="예"
                    cancelText="아니오"
                    showCancel={true} // 취소 버튼 표시 여부
                />
            )}
            {isRestoreAlert  && (
                            
                <CustomAlert
                    type="warning" // success, error, warning, info 중 선택
                    title="확인"
                    message="폴더를 복구하시겠습니까?"
                    onConfirm={handleRestoreConfirm} // 확인 버튼 클릭 핸들러
                    onCancel={handleCancel} // 취소 버튼 클릭 핸들러
                    confirmText="예"
                    cancelText="아니오"
                    showCancel={true} // 취소 버튼 표시 여부
                />
            )}
             {isDeletedAlert  && (
                            
                <CustomAlert
                    type="warning" // success, error, warning, info 중 선택
                    title="확인"
                    message="폴더를 영구삭제 하시겠습니까?"
                    subMessage="해당 폴더 삭제시 더이상 되돌릴 수 없습니다."
                    onConfirm={handleDeleteConfirm} // 확인 버튼 클릭 핸들러
                    onCancel={handleCancel} // 취소 버튼 클릭 핸들러
                    confirmText="예"
                    cancelText="아니오"
                    showCancel={true} // 취소 버튼 표시 여부
                />
            )}
            


        

        <RenameModal
            initialName={folderName} // ContextMenu에서 전달된 folderName
            onRename={(newName) => {
                handleRename(newName); // 상태 업데이트
                contextMenuRef.current?.focus(); // 포커스 이동
            }}
            onCancel={() => {
                setIsRenameModalOpen(false); // 상태 업데이트
                contextMenuRef.current.focus(); // 포커스 이동
            }}
            isOpen={isRenameModalOpen}
            id={folderId}
            type={"folder"}
            path={path}
        />
        </>
    );
}
