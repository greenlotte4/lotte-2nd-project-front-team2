/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { MenuItem } from "./_CustomDropdown";
import { CustomSVG } from "./_CustomSVG";
import axiosInstance from "@/services/axios.jsx";

function ProjectAsideItem({ id, title, isActive, onClick, isOwner, setIsChanging }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  

  const toggleDropdown = (e) => {
    e.stopPropagation(); // 클릭 이벤트 전파 방지
    setIsDropdownOpen((prev) => !prev);
  };

  const handleOutsideClick = (e) => {
    if (!e.target.closest(".dropdown")) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);
  
  const handleDelete = async() => {
    await axiosInstance.delete(`/api/project/${id}`);
    setIsChanging((prev) => !prev);
  };

  return (
    <div 
      className={`flex justify-between items-center px-4 py-3.5 w-full rounded-xl min-h-[50px] ${
        isActive ? 'bg-indigo-100' : 'bg-white'}`}
      onClick={onClick} // Toggle on click
    >
      <div className="relative flex flex-1 shrink gap-2.5 items-center self-stretch my-auto w-full basis-0">
        <CustomSVG id="subject" />
        <span className="flex-1 shrink self-stretch my-auto basis-0">
          {title}
        </span>
        {isOwner&&<button onClick={(e)=>toggleDropdown(e)}><CustomSVG id="more" /></button>}
        {isDropdownOpen && (
            <div
              role="menu"
              aria-labelledby="more"
              className="dropdown absolute mt-1 w-20 py-2 -top-[90%] -right-[50%] bg-white border rounded-md text-gray-600 shadow-md z-30"
            >
              <MenuItem
                onClick={() => {
                  setIsDropdownOpen(false);
                }}
              >
                수정
              </MenuItem>
              <MenuItem
                onClick={() => {
                  handleDelete();
                  setIsDropdownOpen(false);
                }}
                confirm="true"
                tooltip="정말 이 프로젝트를 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다."
                pointColor="red-500"
                border="0"
                icon="trash"
              >
                삭제
              </MenuItem>
            </div>
          )}

      </div>
    </div>
  );
}

export default ProjectAsideItem;