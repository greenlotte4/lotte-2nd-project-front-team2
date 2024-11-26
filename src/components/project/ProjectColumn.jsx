/* eslint-disable react/prop-types */
import { ProjectTaskDynamic } from './ProjectCard';
import { CustomSVG } from "./CustomSVG";
import { useState } from "react";

export const ProjectColumn = ({ title, count, color, projects }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);

  const handleToggle = (index) => {
    // 클릭한 인덱스가 이미 선택된 상태라면, 선택 해제, 아니면 선택
    setSelectedIndex(selectedIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col w-64 min-w-[240px]">
      <div className="flex flex-col w-full text-base leading-none">
        <div className="flex gap-3 items-center w-full min-h-[32px]">
          <div className="flex flex-1 shrink gap-2 items-start self-stretch my-auto basis-0">
            <div className="font-[590] text-black text-opacity-80">{title}</div>
            <div className="text-black text-opacity-50">{count}</div>
          </div>
          <div className="flex shrink-0 self-stretch my-auto h-[22px] w-[34px]" />
        </div>
        <div className={`flex mt-1 w-full rounded-lg ${color} min-h-[4px]`} />
      </div>
      <div className="flex flex-col mt-3 w-full  overflow-y-auto max-h-[560px]">
      {projects.map((project, index) => (
          <ProjectTaskDynamic
            key={index}
            isSelected={selectedIndex === index}
            {...project}
            handleToggle={() => handleToggle(index)}
            />
        ))}
      </div>
        <div className="flex gap-2 items-center px-3 py-2 mt-3 w-full text-center text-black text-opacity-50">
          <CustomSVG id="add" />
          <div className="self-stretch my-auto text-sm leading-none">새 목표</div>
        </div>
    </div>
  );
};