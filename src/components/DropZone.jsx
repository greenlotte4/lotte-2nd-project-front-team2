import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import axiosInstance from '@/services/axios.jsx';
import { useQueries, useQueryClient } from '@tanstack/react-query';
import CustomAlert from './Alert';
import useStorageStore from '../store/useStorageStore';

const MyDropzone = ({ 
  folderId ,
  maxOrder, 
  uid, 
  onUploadProgress,
  onUploadStart, 
  onUploadComplete ,
  triggerAlert,  
}) => {
  const [uploadedFiles, setUploadedFiles] = useState([]); // 업로드된 파일 목록
  const [isUploading, setIsUploading] = useState(false); // 업로드 중 상태
  const [isPopupVisible, setIsPopupVisible] = useState(false); // 팝업 상태
  const queryClient = useQueryClient();
  const storageInfo = useStorageStore((state) => state.storageInfo);

  console.log('storageInfo',storageInfo.currentUsedSize);
  console.log('triggerAlert in MyDropzone:', triggerAlert);



  // 파일 업로드 함수
  const uploadFiles = async (files) => {
   
    const totalFileSize = files.reduce((total, file) => total + file.size, 0);
    if (totalFileSize > storageInfo.currentRemainingSize) {
      triggerAlert(
        'warning',
        '용량 초과',
        `남은 용량(${storageInfo.currentRemainingSize} bytes)보다 큰 파일은 업로드할 수 없습니다.`
      );
      return;
    }

    onUploadStart(); // 업로드 시작 알림
    setIsUploading(true);
  
    const formData = new FormData();
    const relativePaths = []; // 상대 경로 배열
    files.forEach((file) => {
      formData.append("files", file);
      relativePaths.push(file.webkitRelativePath); // 상대 경로 배열에 추가
    });
    formData.append("relativePaths", JSON.stringify(relativePaths)); // 상대 경로 배열을 JSON 문자열로 추가
    formData.append("maxOrder", maxOrder);
    formData.append("uid",uid);

    setIsUploading(true); // 업로드 중 상태로 설정
    try {
      const response = await axiosInstance.post(`/api/drive/upload/${folderId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",

        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total > 0) {
            const percentCompleted = Math.round(
              (progressEvent.loaded / progressEvent.total) * 100
            );
            onUploadProgress(percentCompleted); // 진행률 업데이트
          } else {
            console.warn("총 파일 크기를 알 수 없습니다.");
            onUploadProgress(0); // 0%로 초기화
          }
        },
      });
      queryClient.invalidateQueries(['folderContents']);
      onUploadComplete();
     
      console.log('알럿상태',alert);

      console.log("업로드 성공:", response.data);

      // 업로드 성공 시 파일 목록 업데이트
      setUploadedFiles((prevFiles) => [
        ...prevFiles,
        ...files.map((file) => ({
          name: file.name,
          size: file.size,
        })),
      ]);

      // 팝업 상태 활성화
      setIsPopupVisible(true);
    } catch (error) {
      console.error("업로드 실패:", error);
      // 서버 응답에 따라 알림 메시지 설정
        const errorMessage = error.response?.data || '파일 업로드 중 오류가 발생했습니다. 다시 시도해주세요.';
        const errorType = error.response?.status === 400 ? 'warning' : 'error'; // 상태 코드에 따라 타입 분기

        console.log('업로드 실패!!');
        triggerAlert(errorType, '업로드 실패', errorMessage);


    } finally {

      setIsUploading(false); // 업로드 완료 상태로 설정
    }
  };

  // 드롭존 설정
  const { getRootProps, getInputProps, isDragActive  } = useDropzone({
    onDrop: (acceptedFiles) => {
      const folderStructure = {};
      acceptedFiles.forEach((file) => {
        const filePath = file.webkitRelativePath; // 상대 경로
        folderStructure[filePath] = file;
        console.log("File name:", file.name);
        console.log("Relative path:", file.webkitRelativePath); // 여기서 값이 출력되는지 확인
      });
      console.log("받은 파일들:", acceptedFiles);
      uploadFiles(acceptedFiles); // 파일 업로드 함수 호출
    },
  });
  const closeAlert = () => setAlert({ isVisible: false });

  // 팝업 닫기
  const closePopup = () => {
    setIsPopupVisible(false);
  };

  return (
    <>
    <div>
      {/* 드래그 앤 드롭 영역 */}
      <div
        {...getRootProps()} 
      className={`
        flex items-center justify-center p-10 border-2 border-dashed rounded-lg text-center cursor-pointer 
        ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
      `}
        style={styles.dropzone}
      >
        <input 
          {...getInputProps()}    
          webkitdirectory
        />
        <p className="text-gray-600">파일을 드래그하거나 클릭하여 업로드하세요.</p>
      </div>

      {/* 업로드 중 메시지 */}
      {isUploading && (
        <div className="mt-4 text-center text-blue-600">
          파일 업로드 중입니다. 잠시만 기다려주세요...
        </div>
      )}

      {/* 업로드된 파일 팝업 */}
      {isPopupVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
          style={styles.overlay}
        >
          <div className="bg-white rounded-lg shadow-lg p-6 w-[400px]">
            <h3 className="text-lg font-semibold mb-4">업로드된 파일</h3>
            <ul>
              {uploadedFiles.map((file, index) => (
                <li key={index} className="flex justify-between border-b py-2">
                  <span>{file.name}</span>
                  <span>{(file.size / 1024).toFixed(2)} KB</span>
                </li>
              ))}
            </ul>
            <button
              onClick={closePopup}
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
     {alert.isVisible && (
      <CustomAlert
        type={alert.type}
        title={alert.title}
        message={alert.message}
        onConfirm={() => setAlert({ isVisible: false })}
      />
    )}
    </>
  );
};

const styles = {
  dropzone: {
    border: "1px dashed black",
    borderRadius: "4px",
    padding: "20px",
    textAlign: "center",
    cursor: "pointer",
    height: "170px",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 50,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
};

export default MyDropzone;
