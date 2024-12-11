import React, { useState ,forwardRef } from 'react';
import { X, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosInstance from '../../services/axios';
import { QueryClient, useQueryClient } from '@tanstack/react-query';


const RenameModal = ({
  initialName, 
  onRename, 
  onCancel, 
  isOpen,
  id,
  type,
  path,
}) => {
  const [newName, setNewName] = useState(initialName);
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient(); // Access query client


  if (!isOpen) return null;
  

 

  const handleRename = async () => {
    const updatedPath = `${path.substring(0, path.lastIndexOf('/'))}/${newName}`; // 기존 경로에서 새로운 이름 적용
    const payload = {
      id: id, // 폴더 ID
      type: type, // 폴더 타입
      newName: newName, // 새 이름
      currentPath : path,
      newPath : updatedPath,
  };
    try {
      setIsLoading(true);
      console.log(payload);
      const response = await axiosInstance.put('/api/drive/rename',payload);
      if (response.status === 200) {
        queryClient.invalidateQueries(['folderContents']); // Replace with the relevant query key
        alert('이름 변경 성공');
        onRename(newName); // 부모 컴포넌트에 상태 전달
        onCancel(); // Close modal
      } else {
        console.error('Failed to rename:', response.data);
        alert('이름 변경 실패. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('Error renaming:', error);
      alert('이름 변경 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="w-[90%] max-w-md bg-white/95 rounded-2xl shadow-xl overflow-hidden"
    >
      <div className="px-4 pt-6 pb-4 text-center">
        <h2 className="text-xl font-semibold text-black">
          이름 바꾸기
        </h2>
      </div>
      
      <div className="px-4 pb-4">

        <input 
          type="text" 
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          className="w-full px-3 py-2 bg-gray-100 rounded-lg 
                     text-black text-base 
                     border border-gray-300"
          placeholder="새 이름을 입력하세요"
        />
      </div>
      
      <div className="flex border-t border-gray-200">
        <button 
          onClick={onCancel}
          className="w-1/2 py-3 text-[#007AFF] border-r border-gray-200 
                     active:bg-gray-100 transition-colors"
        >
          취소
        </button>
        <button 
            onClick={handleRename}
            disabled={!newName || isLoading}
          className="w-1/2 py-3 text-[#007AFF] font-semibold 
                     disabled:opacity-50 
                     active:bg-gray-100 transition-colors"
        >
            {isLoading ? '처리 중...' : '확인'}

        </button>
      </div>
    </motion.div>
  </div>
  );
};

export default RenameModal;