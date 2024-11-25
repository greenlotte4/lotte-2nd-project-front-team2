/* eslint-disable react/prop-types */
import { ProjectCard } from './ProjectCard';
import { TaskCard } from './ProjectTaskCard';
import { CustomSVG } from './CustomSVG'
import { useState } from 'react';

export const ProjectColumn = ({ title, count, color, projects }) => {
  
  // projects 상태에 isSelected 필드를 추가
  const [projectStates, setProjectStates] = useState(
    projects.map((project) => ({ ...project, isSelected: false }))
  );

  const handleProjectClick = (index) => {
    setProjectStates((prevStates) =>
      prevStates.map((project, i) =>
        i === index ? { ...project, isSelected: !project.isSelected } : project
      )
    );
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
      <div className="flex flex-col mt-3 w-full">
      {projectStates.map((project, index) => (
        <div key={index} onClick={() => handleProjectClick(index)}>
          {/* isSelected에 따라 TaskCard 또는 ProjectCard 렌더링 */}
          {project.isSelected ? (
            <TaskCard {...project} />
          ) : (
            <ProjectCard {...project} />
          )}
        </div>
      ))}
      </div>
      <div className="flex gap-2 items-center px-3 py-2 mt-3 w-full text-center text-black text-opacity-50">
        <CustomSVG id="add" />
        <div className="self-stretch my-auto text-sm leading-none">새 목표</div>
      </div>
    </div>
  );
};