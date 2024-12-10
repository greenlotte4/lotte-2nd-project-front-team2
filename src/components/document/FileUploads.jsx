import axios from "axios";
import axiosInstance from '@/services/axios.jsx'
import React, { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import MyDropzone from "../DropZone";
import UploadProgressModal from "./uploadProgressModal";
import useStorageStore from "../../store/useStorageStore";


// 날짜 : 2024.11.27
// 이름 : 하진희
// 내용 : 드라이브 생성 

export default function FileUploads({ isOpen, onClose, folderId, fileMaxOrder, folderMaxOrder,uid ,triggerAlert }) {

  const [uploadProgress, setUploadProgress] = useState(null); // 업로드 진행 상황 상태
  const [isUploadInProgress, setIsUploadInProgress] = useState(false);
  const handleUploadStart = () => {
    setIsUploadInProgress(true);
    setUploadProgress(0); // 초기화
  };

  const handleUploadComplete = () => {
    setIsUploadInProgress(false);
    setUploadProgress(null); // 초기화
    onClose(); // 업로드 완료 후 모달 닫기

  };


  if (!isOpen) return null;
  return (<>
   <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-lg max-w-xl w-[480px]">
        <div className="flex justify-between items-center mb-8 pt-6 px-8 rounded-t-lg">
          <div></div>
          <span className="text-xl font-medium">파일 업로드</span>
          <button
            onClick={onClose}
            className="text-xl font-bold text-gray-600 hover:text-gray-900"
          >
            X
          </button>
        </div>
        <div className="p-8">
          <MyDropzone 
            folderId={folderId} 
            folderMaxOrder={folderMaxOrder}
            fileMaxOrder={fileMaxOrder} 
            uid={uid} 
            onUploadProgress={setUploadProgress}
            onUploadStart={handleUploadStart}
            onUploadComplete={handleUploadComplete}
            triggerAlert={triggerAlert}
          />
        </div>
      </div>
    </div>
   {/* 업로드 진행 상황 모달 */}
   {isUploadInProgress && uploadProgress && (
        <UploadProgressModal 
          progress={uploadProgress} 
          onClose={handleUploadComplete} 
        />
      )}
  </>
   
  );
}

