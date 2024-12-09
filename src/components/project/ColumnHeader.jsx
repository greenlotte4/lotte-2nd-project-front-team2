/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { MenuItem } from "./_CustomDropdown";
import { CustomSVG } from "./_CustomSVG";
import axiosInstance from "@/services/axios.jsx";

export const ColumnHeader = ({
  projectId,
  column = [],
  clearTasks,
  setMode,
  onDelete,
}) => {
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

  return (
    <header className="flex flex-col w-full text-base leading-none">
      <div className="flex gap-3 items-center w-full min-h-[32px] relative">
        <div className="relative flex flex-1 shrink gap-2 items-start justify-between self-stretch my-auto basis-0 w-full handle">
          <div>
            <span className="text-black text-opacity-80 text-sm font-[550]">
              {column.title}
            </span>
          </div>
          <button
            onClick={toggleDropdown}
            aria-label="더보기"
            className="dropdown" // 드롭다운 클래스 추가
          >
            <CustomSVG id="more" />
          </button>
          {isDropdownOpen && (
            <div
              role="menu"
              aria-labelledby="more"
              className="dropdown absolute mt-1 w-20 py-2 right-2 bg-white border rounded-md text-gray-600 shadow-md z-30"
            >
              <MenuItem
                onClick={() => {
                  setMode("edit");
                  setIsDropdownOpen(false);
                }}
              >
                수정
              </MenuItem>
              <MenuItem
                onClick={() => {
                  onDelete();
                  setIsDropdownOpen(false);
                }}
                confirm="true"
                tooltip="정말 이 보드를 삭제하시겠어요? 이 작업은 되돌릴 수 없습니다."
                pointColor="red-500"
                border="0"
                icon="trash"
              >
                삭제
              </MenuItem>
              <MenuItem
                onClick={() => {
                  clearTasks();
                  setIsDropdownOpen(false);
                }}
                confirm="true"
                tooltip="한번 더 누르면 보드 안의 모든 목표를 삭제합니다. 이 작업은 되돌릴 수 없습니다."
                pointColor="red-500"
                border="0"
              >
                비우기
              </MenuItem>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex mt-1 w-full rounded-lg min-h-[4px]"
        style={{ background: column.color }}
      ></div>
    </header>
  );
};

export const ColumnHeaderEdit = ({
  projectId,
  column = [],
  setColumn,
  setMode,
  mode,
  onSave,
}) => {
  const [formData, setFormData] = useState(column);

  const text = mode == "new" ? "생성" : "수정";
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // 버튼 클릭 시 처리 함수
  const handleSubmit = async() => {
    const res = await axiosInstance.post(`/api/project/${projectId}`, formData);
    console.log(res.data)
    setColumn((prev) => ({
      ...prev,
      ...res.data,
    }));
    onSave();
  };
  const handleClose = () => {
    if (mode == "new") {
      onSave();
    } else {
      ()=>{setMode("basic");}
    }
  };

  return (
    <section
      className="flex flex-col justify-center w-full p-3 bg-white rounded-lg border border-neutral-400 shadow-[0px_1px_4px_rgba(126,126,223,0.1)]"
      role="article"
    >
      {/* Header Section */}
      <header className="flex justify-between items-center gap-2.5 w-full text-sm text-gray-500">
        <div className="flex justify-between items-center gap-10 w-[199px] p-1.5 bg-neutral-400 bg-opacity-10 rounded-lg">
          {/* 제목 입력란에 상태값을 설정 */}
          <input
            type="text"
            className="my-auto bg-transparent"
            role="heading"
            aria-level="2"
            name="title"
            value={formData.title} // 상태값으로 텍스트 관리
            onChange={handleChange} // 텍스트 입력값 변경
            aria-label="작업 제목 수정"
            placeholder="제목을 입력하세요"
          />
        </div>
        {/* 닫기 버튼 */}
        <button
          onClick={handleClose} // 상태 초기화 (모드 변경)
          aria-label="닫기"
          className="p-2focus:outline-none"
        >
          <CustomSVG id="close" />
        </button>
      </header>

      {/* Label and Color Section */}
      <div className="flex gap-2 items-center mt-2">
        <span className="text-sm text-black text-opacity-50 w-fit">색상</span>
        <div className="flex justify-between items-center min-h-[24px]">
          {/* 색상 입력 */}
          <input
            type="color"
            name="color"
            value={formData.color} // 상태값으로 색상 관리
            onChange={handleChange} // 색상 입력값 변경
            aria-label="색상 선택"
            className="h-[30px] w-[25px] mr-1 bg-none outline-none border-none"
          />
          {/* 텍스트로 색상 표시 */}
          <input
            type="text"
            name="color"
            value={formData.color} // 색상 코드 텍스트로 표시
            onChange={handleChange} // 텍스트 입력 시 색상 변경
            aria-label="색상 코드"
            className="w-[60px] p-1 text-xs border rounded-md"
          />
        </div>
      </div>

      {/* Action Button Section */}
      <div className="flex justify-center items-start mt-2 w-full text-sm font-medium tracking-wide leading-6 uppercase text-slate-500">
        <button
          className="flex flex-col justify-center items-center rounded-lg border border-slate-500 border-opacity-50 overflow-hidden px-4 py-1"
          tabIndex="0"
          aria-label={text}
          onClick={handleSubmit}
        >
          {text}
        </button>
      </div>
    </section>
  );
};
