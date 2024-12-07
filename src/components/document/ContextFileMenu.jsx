import React, { useEffect, useRef, useState } from "react";
import { FaTrash, FaDownload, FaEdit, FaStar, FaShareAlt, FaInfo } from 'react-icons/fa';
import RenameModal from "./ChangeName";
import axiosInstance from "../../services/axios";
import { useQueryClient } from "@tanstack/react-query";


export default function ContextFileMenu({
    visible,
    position,
    onClose,
    file,
    fileId,
    fileName,
    path,
    onDetailToggle,
    downloadHandler,
}) {
    const contextFileMenuRef = useRef(null);
    const renameModalRef = useRef(null); // RenameModal의 레퍼런스
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(fileName); // 폴더 이름 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client

    const actions = [
        {
            id: 'trash',
            label: '휴지통',
            icon: FaTrash,
            color: 'text-red-500',
            onClick: (file) => console.log(`휴지통 이동: ${file.name}`),
        },
        {
            id: 'download',
            label: '다운로드',
            icon: FaDownload,
            color: 'text-blue-500',
            onClick: () => downloadHandler(file),
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
            onClick: (file) => console.log(`즐겨찾기 추가: ${file.name}`),
        },
        {
            id: 'share',
            label: '공유',
            icon: FaShareAlt,
            color: 'text-purple-500',
            onClick: (file) => console.log(`공유: ${file.name}`),
        },
        {
            id: 'info',
            label: '상세정보',
            icon: FaInfo,
            color: 'text-purple-500',
            onClick: () => {
                console.log(`상세정보: ${file.name}`);
                onDetailToggle();
            },
        },
    ];

    const openRenameModal = (file) => {
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
        console.log('Delete folder:', fileId);
        setIsAlertOpen(true); // CustomAlert 열기

        // 폴더 삭제 로직
    };

    const handleConfirm = async() => {
        console.log('Deleting folder:', fileId);
        setIsAlertOpen(false); // CustomAlert 닫기
    
        // 폴더 삭제 로직
        try {
            // 실제 삭제 API 호출
           const response =  await axiosInstance.delete(`/api/drive/file/delete/${fileId}`,
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
    
    
    
    const handleCancel = () => {
        setIsAlertOpen(false); // CustomAlert 닫기
    };

    const handleShare = () => {
        console.log('Share folder:', fileId);
        // 폴더 공유 로직
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            // If the RenameModal is open, handle clicks outside both the ContextMenu and RenameModal
        if (isRenameModalOpen) {
            if (
                contextFileMenuRef.current &&
                !contextFileMenuRef.current.contains(event.target) &&
                renameModalRef.current &&
                !renameModalRef.current.contains(event.target)
            ) {
                onClose();
                setIsRenameModalOpen(false);
            }
        } else {
            // If the RenameModal is not open, only check clicks outside the ContextMenu
            if (
                contextFileMenuRef.current &&
                !contextFileMenuRef.current.contains(event.target)
            ) {
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
            ref={contextFileMenuRef}
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
                        onClick={() => action.onClick(file)}
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

        <RenameModal
            initialName={fileName} // ContextMenu에서 전달된 folderName
            onRename={(newName) => {
                handleRename(newName); // 상태 업데이트
                contextFileMenuRef.current?.focus(); // 포커스 이동
            }}
            onCancel={() => {
                setIsRenameModalOpen(false); // 상태 업데이트
                contextFileMenuRef.current.focus(); // 포커스 이동
            }}
            isOpen={isRenameModalOpen}
            id={fileId}
            type={"folder"}
            path={path}
        />
        </>
    );
}
