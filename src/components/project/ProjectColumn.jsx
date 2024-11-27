/* eslint-disable react/prop-types */
import { ProjectTaskDynamic } from './ProjectTask';
import { CustomSVG } from "./CustomSVG";
import { useState } from "react";
import NewTask from './NewTask';

export const ProjectColumn = ({ title, color, projects=[] }) => {
  const columnClassName ="flex items-center p-3 h-6 text-xs hover:bg-gray-100 cursor-pointer"
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isNewTaskAdded, setIsNewTaskAdded] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddTask = () => {
    // 추가된 컴포넌트가 없을 경우에만 추가
    if (!isNewTaskAdded) {
      setIsNewTaskAdded(true);
    }
  };
  const handleToggle = (index) => {
    // 클릭한 인덱스가 이미 선택된 상태라면, 선택 해제, 아니면 선택
    setSelectedIndex(selectedIndex === index ? null : index);
  };
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  return (
    <div className="flex flex-col w-64 min-w-[240px]">
      <div className="flex flex-col w-full text-base leading-none">
        <div className="flex gap-3 items-center w-full min-h-[32px]">
          <div className="relative flex flex-1 shrink gap-2 items-start justify-between self-stretch my-auto basis-0 w-full">
            <div>
              <span className="font-[590] text-black text-opacity-80">{title} </span>
              <span className="text-black text-opacity-50">{projects.length}</span>
            </div>
            <button onClick={toggleDropdown}>
              <CustomSVG id="more"/>
            </button>
            {isDropdownOpen && (
              <div className="absolute mt-1 w-20 py-2 right-2 bg-white border rounded-md text-gray-600 shadow-md z-30">
                  <div className={columnClassName} onClick={toggleDropdown}>수정</div>
                  <div className={columnClassName} onClick={toggleDropdown}>삭제</div>
                  <div className={columnClassName} onClick={toggleDropdown}>비우기</div>
              </div>
            )}
          </div>
        </div>
        <div className="flex mt-1 w-full rounded-lg min-h-[4px] bg-[linear-gradient(0deg,rgba(245,35,75,0.40_0%,rgba(245,35,75,0.40)_100%),#F5234B)]" style={{background:color,}}></div>
      </div>
      <div className="flex flex-col mt-3 w-full overflow-y-auto max-h-[600px] scrollbar-none">
      {projects.map((project, index) => (
          <ProjectTaskDynamic
            key={index}
            isSelected={selectedIndex === index}
            {...project}
            handleToggle={() => handleToggle(index)}
            />
        ))}
        {isNewTaskAdded && (<NewTask setIsAdded={setIsNewTaskAdded} />)}
      </div>
        <button onClick={handleAddTask} className="flex gap-2 items-center px-3 py-2 mt-3 w-full text-center text-black text-opacity-50">
          <CustomSVG id="add" />
          <div className="self-stretch my-auto text-sm leading-none">새 목표</div>
        </button>
    </div>
  );
};