import React, { useState } from 'react'
import '@/components/document/DocumentCard1.scss'
import ContextMenu from './ContextMenu';
import ContextFileMenu from './ContextFileMenu';

export const DocumentCard2 = ({
  file,
  fileId,
  fileName,
  path,
  savedName,
  onDragStart, 
  onDragOver, 
  onDrop,
  updatedAt,
  onContextMenu,
  setSeletedFile,
  downloadHandler
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 }); // 메뉴 위치


  const handleFavoriteToggle = async () => {
    setIsFavorite((prev) => !prev); // 즐겨찾기 상태 변경

    try {
        const response = await axiosInstance.put(`/api/drive/folder/${folderId}/favorite`, {
            isFavorite: !isFavorite, // 새로운 상태를 백엔드에 전달
        });

        if (response.status === 200) {
            console.log('즐겨찾기 상태 업데이트 성공');
        } else {
            console.error('즐겨찾기 상태 업데이트 실패:', response.data);
        }
    } catch (error) {
        console.error('즐겨찾기 상태 업데이트 중 오류 발생:', error);
        setIsFavorite((prev) => !prev); // 실패 시 상태를 원복
    }
};

const toggleMenu = (e) => {
    e.preventDefault(); // 기본 컨텍스트 메뉴 방지
    console.log('Folder for context menu:', file); // 디버깅용

    setMenuPosition({ top: e.clientY, left: e.clientX }); // 클릭 위치 기반으로 위치 설정
    setIsMenuOpen(true); // 메뉴 열기
};

    const handleRename = () => {
      console.log('Rename folder:', folderId);
      // 이름 변경 로직
  };

  const openRenameModal = () => {
    setIsRenameModalOpen(true);
    setIsMenuOpen(false); // 메뉴 닫기
};

const closeRenameModal = () => {
    setIsRenameModalOpen(false);
};

  const handleDelete = () => {
      console.log('Delete folder:', folderId);
      confirm('정말 삭제하시겠습니까?');

      // 폴더 삭제 로직
  };

  const handleShare = () => {
      console.log('Share folder:', folderId);
      // 폴더 공유 로직
  };
  const fileServerBaseUrl = "http://3.35.170.26:90/thumbnails/"; // File server base URL
  const thumbnails = savedName + ".jpg";
  const thumbnailUrl = `${fileServerBaseUrl}${thumbnails}`;
  console.log(thumbnailUrl);
  console.log(savedName);

  return (
    <div className='document-card2 inline-block bg-background-gray w-[300px] h-[300px] rounded-[8px] relative'
                    draggable
                    onContextMenu={(e) => onContextMenu(e, file)} // Trigger the context menu
                    onDragStart={(e) => {
                        e.stopPropagation(); // Prevent event propagation
                        onDragStart(file); // Call the passed onDragStart function
                    }}                 
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => onDrop(file)}
                    style={{
                        border: '1px solid #ccc',
                        padding: '10px',
                        margin: '5px',
                        cursor: 'grab',
                        position: 'relative', // Ensure this is relative for child absolute positioning
                    }}

    >
        <div className='text-center relative'>
          <p className='text-xs opacity-40 leading-[50px]'>{fileName}</p>
          <img
                    className="absolute cursor-pointer right-[10px] top-[22px] rotate-90 "
                    src="/images/button-dot.png"
                    alt="버튼"
                    onClick={toggleMenu} // 메뉴 열기
                />
            {/* {isMenuOpen && (
                <div className="absolute top-[40px] right-[10px] bg-white shadow-md rounded-md z-20">
                    <ul className="py-2">
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={downloadHandler}
                        >
                            다운로드
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleRename}
                        >
                            이름 변경
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleDelete}
                        >
                            휴지통
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleShare}
                        >
                            공유하기
                        </li>
                    </ul>
                </div>
            )} */}
        </div>
        <div className='bg-white w-[280px] h-[240px] absolute top-[50px] left-[10px]'>
          <div className='flex items-center justify-center mb-4 w-full h-full'>
          <img 
           className='w-full h-full '
            src={thumbnailUrl} 
            alt="Thumbnail" 
            onError={(e) => console.error(`Failed to load image: ${thumbnailUrl}`, e)}
          />        
          </div>
          <div className='flex flex-col justify-center items-center'>
          </div>
        </div>
        {isMenuOpen && (
                 <ContextFileMenu
                    type={"file"}
                    visible={true}
                    position={menuPosition}
                    file={file}
                    fileName={fileName}
                    fileId={fileId}
                    path={path}
                    downloadHandler={(fileId) => downloadHandler(fileId)} // Pass selectedFolder
                />
            )}
    </div>
  )
}
