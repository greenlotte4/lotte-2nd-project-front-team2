import React from "react";
import ProjectAsideItem from "./ProjectAsideItem";
import { CustomSVG } from "./CustomSVG";

function ProjectAsideSection({ data, isCompleted, isOpen, toggleSection }) {
  const { title, items } = data;

  return (
    <div className="flex flex-col mt-4 w-full text-black">
      {/* 헤더 (섹션 제목과 아이콘) */}
      <div
        className="flex gap-10 justify-between items-center w-full text-lg cursor-pointer"
        onClick={toggleSection} // 클릭 이벤트로 토글
      >
        <h2
          className={`self-stretch my-auto w-[205px] ${isCompleted ? "text-neutral-500" : ""}`}
        >
          <span className="text-sm">{title}</span>
        </h2>
        <CustomSVG id={isOpen ? "expand-up" : "expand-down"} size={24} />
      </div>

      {/* 아이템 리스트 (토글된 상태에 따라 보여줌) */}
      {isOpen && (
        <div
          className={`flex flex-col pl-5 mt-2.5 w-full ${
            isCompleted ? "text-sm text-neutral-500" : "text-sm"
          }`}
        >
          {items.map((item, index) => (
            <ProjectAsideItem
              key={index}
              title={item.title}
              isActive={item.isActive}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default ProjectAsideSection;
