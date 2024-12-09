import React from 'react';

const UploadProgressModal = ({ progress, onClose }) => {
  // Ensure progress is a number and between 0 and 100
  const safeProgress = typeof progress === 'number' 
  ? Math.max(0, Math.min(100, progress)) 
  : 0;

  return (
    <div className="fixed bottom-4 right-4 inset-0 bg-black bg-opacity-50 flex justify-center items-center z-[100]">
      <div className="bg-white rounded-lg shadow-lg p-8 w-[400px]">
        <h2 className="text-xl font-semibold mb-4 text-center">파일 업로드 중</h2>
        
        <div className="w-full bg-gray-200 rounded-full h-4 mb-4">
          <div 
            className="bg-blue-600 h-4 rounded-full transition-all duration-300 ease-out" 
            style={{ width: `${safeProgress}%` }}
          ></div>
        </div>
        
        <div className="text-center text-gray-700 mb-6">
          {safeProgress.toFixed(0)}% 업로드 완료
        </div>
        
        <div className="flex justify-center">
          <button 
            onClick={onClose} 
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
          >
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadProgressModal;