import axios from "axios";
import axiosInstance from '@/services/axios.jsx'
import React, { useEffect, useState } from "react";
import useUserStore from "../../store/useUserStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 날짜 : 2024.11.27
// 이름 : 하진희
// 내용 : 드라이브 생성 


const initState = {
  name: "",
  owner: "",
  description: "",
  order: 1,
  shareUsers : [],
  isShared : 0,
  status: 1,
  linkSharing: "0", // 허용안함
};

export default function NewDrive({ isOpen, onClose }) {
  const [authType, setAuthType] = useState("0"); // 기본값: '나만 사용'
  const [formData, setFormData] = useState(initState);
  const queryClient = useQueryClient();



  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleRadioChange = (e) => {
    const value = e.target.value;
    setAuthType(value); // 라디오 버튼 상태 업데이트
    setFormData({ ...formData, isShared: value });
  };

  // 컴포넌트가 로드될 때 owner에 currentUser 값을 설정
  useEffect(() => {
    setFormData((prev) => ({
      ...prev
    }));
  }, []);

   // 드라이브 마스터 설정 또는 업데이트
   const handleSelectMaster = () => {
    if (!user.uid.trim()) return; // 값이 없으면 설정하지 않음
    setFormData({
      ...formData,
      driveMaster: user.uid, // 선택된 이름
      masterEmail: user.email, // 예시 이메일 생성
    });
  };

    // 드라이브 마스터 제거
    const handleRemoveMaster = () => {
      setFormData({
        driveMaster: null,
        masterEmail: null,
      });
    };

  // const handleAddSharedUser = () => {
  //   if (!user.uid.trim() || formData.sharedUsers.length >= 3) return;
  //   setFormData({
  //     ...formData,
  //     sharedUsers: [...formData.sharedUsers, user.uid],
  //   });
  // };

  const handleRemoveSharedUser = (user) => {
    setFormData({
      ...formData,
      sharedUsers: formData.sharedUsers.filter((u) => u !== user),
    });
  };

    // Mutation 정의
    const { mutate, isLoading, isError } = useMutation({
      mutationFn: async (newDriveData) => {
        const response = await axiosInstance.post("/api/drive/newDrive", newDriveData);
        return response.data;
      },
      onSuccess: (data) => {
        console.log("Drive created successfully:", data);
        queryClient.invalidateQueries({ queryKey: ['driveList'] })
        onClose();
      }, 
      onError: (error) => {
        console.error("Error creating drive:", error);
      },
    });

  const handleSubmit = async () => {
      mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 modal-custom-fixed shadow-[0 4px 6px rgba(0, 0, 0, 0.1)]">
  <div className="bg-white rounded-lg shadow-lg max-w-2xl w-[600px] modal-custom-width">
    <div className="flex justify-between mb-8 pt-10 px-12  rounded-t-lg">
      <div></div>
      <span className="text-2xl">드라이브 만들기</span>
      <button
        onClick={onClose}
        className="text-xl float-right display-block font-bold text-gray-600 hover:text-gray-900"
      >
        X
      </button>
    </div>
    <div className=" w-[90%]  px-[20px] py-[30px] bg-white rounded-[12px] text-center my-[20px] mx-auto">
      <div className="flex gap-8 mb-4 justify-start items-left">
        <span className="w-20">이름</span>
        <div>
          <input
            className="h-10 w-[350px] border rounded-md p-2 text-xs"
            placeholder="폴더 이름"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="flex gap-8 mb-4 justify-start items-center">
        <span className="w-20">설명</span>
        <div>
          <input
            className="h-10 w-[350px] border rounded-md p-2 text-xs"
            placeholder="폴더 설명"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
          ></input>
        </div>
      </div>
      <div className="flex gap-8 mb-4 justify-start items-center">
        <span className="w-20">공유 범위</span>
        <div className="text-xs opacity-60 flex gap-4">
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="authType"
              value="0"
              checked={authType === "0"}
              onChange={handleRadioChange}
            />
            나만 사용
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="authType"
              value="1"
              checked={authType === "1"}
              onChange={handleRadioChange}
            />
            선택한 구성원
          </label>
          <label className="flex items-center gap-1">
            <input
              type="radio"
              name="authType"
              value="2"
              checked={authType === "2"}
              onChange={handleRadioChange}
            />
            전체 구성원
          </label>
        </div>
      </div>
      {/* 드라이브 마스터 및 공유 인원은 '나만 사용'이 아닐 때만 표시 */}
      {authType !== "0" && (
        <>
          {/* <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">드라이브 마스터</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2 justify-between">
              <input
                  value={currentUser}
                  onChange={(e) => setCurrentUser(e.target.value)}
                  className="h-10 w-[260px] border rounded-md p-2 text-xs"
                  placeholder="구성원 또는 조직으로 검색"
                />
                <button
                  onClick={handleSelectMaster}
                  className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100"
                >
                  주소록
                </button>
              </div>
              {/* {formData.driveMaster && (
                <div className="masterArea flex gap-2">
                  <img src="/images/document-folder-profile.png" alt="Profile" />
                  <div className="flex flex-col justify-between">
                    <p className="text-xs">{formData.driveMaster}</p>
                    <p className="text-xs text-gray-400">{formData.masterEmail}</p>
                  </div>
                  <div className="flex items-center">
                    <select className="outline-none text-xs text-center text-gray-400">
                      <option>읽기</option>
                      <option>쓰기</option>
                      <option selected>모든권한</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div> */}
          <div className="flex gap-8 mb-8 justify-start items-start">
            <span className="w-20">공유 인원</span>
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <input
                  className="h-10 w-[260px] border rounded-md p-2 text-xs"
                  placeholder="구성원 또는 조직으로 검색"
                ></input>
                <button className="border h-10 w-20 rounded-md px-3 text-xs text-gray-400 bg-gray-100">
                  주소록
                </button>
              </div>
            </div>
          </div>
          <div className="flex gap-8 mb-8 justify-start items-center">
        <span className="w-20 ">링크 공유</span>
        <div>
          <select 
              name="linkSharing"
              value={formData.linkSharing}
              onChange={handleInputChange}
            className="h-10 w-[350px] border-none rounded-md p-2 text-xs outline-none text-center">
            <option value="1">허용함</option>
            <option value="0">허용안함</option>
          </select>
        </div>
      </div>
        </>
      )}
      
      <div className="mb-8 flex justify-end gap-2 mr-[40px] bg-white">
        <button
          onClick={onClose}
          className="bg-gray-100 w-20 h-8 rounded-md text-xs"
        >
          취소
        </button>
        <button className="bg-[#5d5ddd] white w-20 h-8 rounded-md text-xs" onClick={handleSubmit}>
          만들기
        </button>
      </div>
    </div>
  </div>
</div>
  );
}
