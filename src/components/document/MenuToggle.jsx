import { useRef, useState } from "react";
import axiosInstance from "../../services/axios";
import { useQueryClient } from "@tanstack/react-query";
import CustomAlert from "./CustomAlert";
import RenameModal from "./ChangeName";


export const MenuToggle = ({
    folderName,
    folderId,
    path,
    })=> {
    const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리
    const [isRenameModalOpen, setIsRenameModalOpen] = useState(false); // RenameModal 상태
    const [newName, setNewName] = useState(folderName); // 폴더 이름 상태
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const queryClient = useQueryClient(); // Access query client



    const toggleMenu = () => {
        setIsMenuOpen((prev) => !prev); // 메뉴 열고 닫기 토글
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

    const menuRef = useRef(null); // 메뉴 DOM 참조



    return(<>
         <div ref={menuRef}  className="absolute top-[40px] right-[10px] overflow-visible bg-white shadow-md rounded-md z-20">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={openRenameModal}
                        >
                            이름 변경
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleDelete}
                        >
                           휴지통으로 이동
                        </li>
                        {isAlertOpen && (
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
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleShare}
                        >
                            공유하기
                        </li>
                    </ul>
                </div>
                <RenameModal  initialName={newName}
                                        onRename={handleRename}
                                        onCancel={closeRenameModal}
                                        isOpen={isRenameModalOpen} 
                                        id={folderId}
                                        type={"folder"}
                                        path={path}
                                        
                                        />
    
    </>);
};