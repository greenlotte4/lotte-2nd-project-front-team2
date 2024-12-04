import axios from "axios";
import axiosInstance from '@/services/axios.jsx'
import React, { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import MyDropzone from "../DropZone";


// 날짜 : 2024.11.27
// 이름 : 하진희
// 내용 : 드라이브 생성 

export default function FileUploads({ isOpen, onClose, folderId, maxOrder, uid }) {
  if (!isOpen) return null;

  return (
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
          <MyDropzone folderId={folderId} maxOrder={maxOrder} uid={uid} />
        </div>
      </div>
    </div>
  );
}


// export default function FileUploads({ isOpen, onClose, folderId,maxOrder,uid }) {
//     if (!isOpen) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed">
//       <div className="bg-white rounded-lg shadow-lg max-w-2xl w-[550px] modal-custom-width">
//         <div className="flex justify-between mb-8 pt-10 px-12  rounded-t-lg">
//           <div></div>
//           <span className="text-2xl">파일 업로드</span>
//           <button
//             onClick={onClose}
//             className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
//           >
//             X
//           </button>
//         </div>
//         <div className="modal-content mx-[40px]">
//             <MyDropzone folderId={folderId} maxOrder={maxOrder} uid={uid}/>
//         </div>
//       </div>
//     </div>
//   );
// }
