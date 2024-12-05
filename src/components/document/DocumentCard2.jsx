import React, { useState } from 'react'
import '@/components/document/DocumentCard1.scss'

export const DocumentCard2 = ({
  file,  
  fileName,
  path,
  savedName,
  downloadHandler
}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false); // 토글 상태 관리

  const toggleMenu = () => {
      setIsMenuOpen((prev) => !prev); // 메뉴 열고 닫기 토글
  };

    const handleRename = () => {
      console.log('Rename folder:', folderId);
      // 이름 변경 로직
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
    <div className='document-card2 inline-block bg-background-gray w-[300px] h-[300px] rounded-[8px] relative'>
        <div className='text-center relative'>
          <p className='text-xs opacity-40 leading-[50px]'>{fileName}</p>
          <img
                    className="absolute cursor-pointer right-[10px] top-[22px] rotate-90 "
                    src="/images/button-dot.png"
                    alt="버튼"
                    onClick={toggleMenu} // 메뉴 열기
                />
            {isMenuOpen && (
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
                            폴더 삭제
                        </li>
                        <li
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                            onClick={handleShare}
                        >
                            공유하기
                        </li>
                    </ul>
                </div>
            )}
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
       
    </div>
  )
}
