import React, { useEffect, useRef, useState } from 'react';
import '@/components/document/DocumentCard1.scss';
import { Link, useNavigate } from 'react-router-dom';
import RenameModal from './ChangeName';
import CustomAlert from './CustomAlert';
import axiosInstance from '../../services/axios';
import { useQueryClient } from '@tanstack/react-query';
import { MenuToggle } from './MenuToggle';
import ContextMenu from './ContextMenu';

export const DocumentCard3 = ({
    cnt,
    folderName,
    folderId,
    folder,
    path,
    onDragStart, 
    onDragOver, 
    onDrop,
    updatedAt,
    onContextMenu,
    onClick,
    isActive,
    downloadHandler, // 수정: folder 객체 전달

}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client

    const navigate = useNavigate();
    const menuRef = useRef(null); // 메뉴 DOM 참조
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(folderName); // 폴더 이름 상태
    const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // 메뉴 위치


    const toggleMenu = (e) => {
        e.preventDefault(); // 기본 컨텍스트 메뉴 방지
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
        navigate(`/document/list/${folderId}`,{
            state: {
                cnt,
                folderName,
                folderId,
                updatedAt,
            }
        });
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
                /* .then((response) => {
                    if (response.status === 200) {
                        alert('폴더가 삭제되었습니다.');
                        // QueryClient로 폴더 목록 업데이트
                        queryClient.invalidateQueries(['folderContents']);
                    }
                })
                .catch((error) => {
                    console.error('삭제 실패:', error);
                    alert('폴더 삭제에 실패했습니다. 다시 시도해주세요.');
                });
        } catch (error) {
            console.error('폴더 삭제 중 오류 발생:', error);
        } */
    };
    
    const handleCancel = () => {
        setIsAlertOpen(false); // CustomAlert 닫기
    };

    const handleShare = () => {
        console.log('Share folder:', folderId);
        // 폴더 공유 로직
    };

    return (
        <div
            className={`document-card3 w-[180px] h-[150px] flex-col flex-wrap items-center z-1 hover:bg-[#f1f1f8] ${isActive ? 'active' : ''}`}
            draggable
            onContextMenu={(e) => {
                e.preventDefault();
                onContextMenu(e, folder);
            }}
            onClick={onClick}
            onDragStart={(e) => {
                e.stopPropagation();
                onDragStart(folder);
            }}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => onDrop(folder)}
            style={{
                border: '1px solid #ccc',
                padding: '10px',
                margin: '5px',
                cursor: 'grab',
                position: 'relative',
            }}
        >
            <div className=" flex flex-col w-full items-center mr-[20px]">
                <div className='flex text-center h-[25px] justify-between w-full mx-[5px]'>
                    <input type="checkbox" className='w-[25px] h-[25px]' name="" id="" />
                    <div></div>
                </div>
            
                <button>
                    <img className=" w-[50px] h-[60px]" src="/images/document-open-folder.png" />
                </button>
            </div>

            <div className="flex-col text-center  mr-[20px] w-full">
                <p className="text-xs  text-center " onClick={(e)=> { e.preventDefault; navigateHandler()}}>{cnt} files</p>
            </div>
            <div className="flex mt-2 justify-between ">
                <div></div>
                <p className=" text-center ml-[25px]  text-blue-900 text-sm 	" onClick={(e)=> { e.preventDefault; navigateHandler()}}>{folder.name}</p>
                <img className='w-[25px] h-[25px] opacity-80	 hover:opacity-100' src="/images/star_off.png" alt="" />
            </div>
         
            {isMenuOpen && (
                 <ContextMenu
                    visible={true}
                    position={menuPosition}
                    folder={folder}
                    folderName={folder.name}
                    folderId={folder.id}
                    path={folder.path}
                />
            )}
                       


        </div>
    );
};
