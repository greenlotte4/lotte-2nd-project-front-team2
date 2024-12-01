/* eslint-disable react/prop-types */
import { useState } from "react";
import { CustomSVG } from "./CustomSVG";

export const ProjectTaskDynamic = ({
  isSelected,
  title,
  content,
  priority,
  status,
  duedate,
  subTasks = [],
  checked = 0,
  tags = [],
  commentsList = [],
  handleToggle,
}) => {
  const [showInput, setShowInput] = useState(false); // 입력창 표시 상태
  const [newSubTask, setNewSubTask] = useState(""); // 새로운 하위 목표 값

  const getPriorityColor = () => {
    if (priority < 2) return "#EC6240";
    if (priority > 2) return "#2A63F6";
    if (priority === 2) return "#F3AF3D";
    return "#00000050";
  };

  const color = getPriorityColor();
  const handleAddSubTask = () => {
    if (newSubTask.trim() === "") return; // 빈 입력 무시
    // 하위 목표 추가 로직 (API 호출 또는 상태 업데이트)
    console.log("New SubTask:", newSubTask);
    setNewSubTask(""); // 입력창 초기화
    setShowInput(false); // 입력창 닫기
  };
  const [nowSubTasks, setSubTasks] = useState(subTasks);

  // 체크박스 상태 업데이트 함수
  const handleCheckboxChange = (id) => {
    setSubTasks((prevSubTasks) =>
      prevSubTasks.map((subTask) =>
        subTask.id === id
          ? { ...subTask, isChecked: !subTask.isChecked }
          : subTask
      )
    );
  };


  return (
    <div className="flex gap-1 p-3 mt-2 w-full bg-white rounded-lg border shadow-sm border-black/10 cursor-pointer"
      onClick={handleToggle}>
      

        {/* Conditionally Render Content */}
        {isSelected ? (
          <div className="flex flex-col flex-1 w-full">
          {/* Title and Priority */}
          <div className="flex justify-between items-start py-px pl-1.5 gap-2">
            <div className="text-sm">{title}</div>
            <div className="w-[20px]">
              <CustomSVG id={`p${priority}`} color={color}/>
            </div>
          </div>
            {/* Content Section */}
            {content && (
              <section className="flex gap-1.5 items-start pt-1.5">
                <CustomSVG id="subject" color="#00000050" />
                <p className="flex-1 text-sm text-black/50">{content}</p>
              </section>
            )}
{/* 하위 목표 */}
<section className="flex flex-col mt-1.5">
            {nowSubTasks.map((subTask,index) => (
              <div
                className="flex items-center gap-1.5 h-[22px]"
                key={subTask.id}
              >
                <input id={"check"+index} checked={subTask.isChecked ? true : false} type="checkbox" className="screen-reader" 
            onChange={(e) => {
              e.stopPropagation(); handleCheckboxChange(subTask.id)}}/>
                <label htmlFor={"check"+index} className="flex-1 text-neutral-500">
                  <CustomSVG
                    id={subTask.isChecked ? "checkbox-checked" : "checkbox"}
                    color={subTask.isChecked ? "#A2A2E6" : "#8A8AE2"}
                  />
                  {subTask.name}
                </label>
                
              </div>
            ))}
            {/* 새 하위 목표 추가 버튼 및 입력창 */}
            {showInput ? (
              <div className="flex items-center gap-2 mt-2">
                
                <button
                  className=" text-gray-500 bg-gray-200 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowInput(false);}}
                >
                <CustomSVG id="close" />
                </button>
                <input
                  type="text"
                  value={newSubTask}
                  onClick={(e) => {e.stopPropagation();}}
                  onChange={(e) => setNewSubTask(e.target.value)}
                  placeholder="새 하위 목표 입력"
                  className="flex-1 px-2 py-1 border rounded-lg outline-none text-sm"
                />
                <button
                  className=" text-white bg-blue-500 rounded-xl"
                  onClick={(e) => {
                    e.stopPropagation();handleAddSubTask}}
                >
                  
                <CustomSVG id="add" />
                </button>
                
              </div>
            ) : (
              <button
                className="flex items-center justify-center gap-1.5 py-1.5 mt-2 text-sm rounded-lg bg-gray-600/10 text-gray-600/60"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowInput(true);}}
              >
                <CustomSVG id="add-checkbox" />
                <span className="text-sm">
                  {checked}/{subTasks.length} 새 하위 목표 생성
                </span>
              </button>
            )}
          </section>

            {/* Tags Section */}
            {tags.length > 0 && (
              <section className="flex flex-wrap gap-2 mt-1.5 text-xs text-black/50">
                <CustomSVG id="tag" />
                {tags.map((tag, index) => (
                  <div
                    key={index}
                    className="px-2 py-1 rounded-2xl bg-zinc-700/10 text-xs"
                  >
                    {tag}
                  </div>
                ))}
              </section>
            )}

            {/* Due Date and Comments Section */}
            <section className="flex flex-wrap gap-2 mt-1.5 text-sm text-gray-600/60">
              {duedate && (
                <div className="flex items-center gap-1.5 w-[232px]">
                  <CustomSVG id="calendar" />
                  <time>{duedate}</time>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <CustomSVG id="comment" />
                <span>의견 {commentsList.length}</span>
              </div>
              {commentsList.map((comment) => (
                <article
                  className="flex gap-1.5 items-start w-[232px] text-sm"
                  key={comment.id}
                >
                  <img
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/5005caf306e020a63875ae89317ed34981ec083804afbfa938c3ea7760d10078"
                    alt=""
                    className="w-5 h-5 rounded-full"
                  />
                  <div className="flex-1">
                    <span className="text-gray-600">{comment.user}</span>
                    <time className="text-gray-600"> {comment.rdate}</time>
                    <p>{comment.content}</p>
                  </div>
                </article>
              ))}
              <form className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-600/10">
                <CustomSVG id="reply" />
                <input
                  type="text"
                  placeholder="의견 작성하기"
                  className="w-full bg-transparent outline-none"
                  aria-label="의견 작성하기"
                />
              </form>
            </section>

            {/* Action Buttons */}
            <section className="flex justify-center gap-1.5 mt-1.5 text-sm text-slate-500">
              <button className="px-6 py-1 border rounded-lg border-slate-500/50">
                수정
              </button>
              <button className="px-4 py-1 border rounded-lg border-transparent">
                삭제
              </button>
            </section>
          </div>
        ) : (
          <>
           {status != null &&
              <div className={'flex flex-col justify-start items-center px-0.5 py-px w-6 text-lg leading-none whitespace-nowrap min-h-[24px]'}>
                <CustomSVG id={status==='active'?'circle-unchecked':status==='completed'?'circle-checked-filled':'circle-checked'} color={color}/> 
              </div>
            }
            
            <div className="flex flex-col flex-1 shrink basis-0 text-black text-opacity-50">
              <div className={`${status==='active'?'':'line-through'} text-sm leading-4 min-h-[24px] `}>{title}</div>
              {content && (
                <div className={`${status==='active'?'':'line-through'} max-w-[200px] leading-4 truncate text-xs`}>{content}</div>
              )}
              {subTasks && duedate &&commentsList && 
                <div className="flex flex-wrap gap-2 items-start pt-3 w-full text-xs leading-none">
                  {subTasks && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="add-checkbox" size="18"/>
                      <div className="self-stretch my-auto text-ellipsis">{checked}/{subTasks.length}</div>
                    </div>
                  }
                  {duedate && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="calendar" size="18"/>
                      <div className="self-stretch my-auto text-ellipsis">{duedate}</div>
                    </div>
                  }
                  {commentsList && 
                    <div className="flex gap-1 items-center whitespace-nowrap">
                      <CustomSVG id="comment" size="18"/>
                      <div className="self-stretch my-auto text-ellipsis">{commentsList.length}</div>
                    </div>
                  }
                </div>
              }
              {/* Tags */}
              {tags.length>0 && (
                <div className="flex items-center gap-1 pt-2 text-sm">
                  <CustomSVG id="tag" size="18"/>
                  <div>
                    {tags[0]}
                    {tags.length > 1 && ` +${tags.length - 1}`}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
  )
}
