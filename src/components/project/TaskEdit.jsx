/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { CustomSVG } from "./_CustomSVG";
import useUserStore from "@/store/useUserStore"
import { createPortal } from "react-dom";
import { PROFILE_URI } from "../../api/_URI";

function Portal({ children }) {
  return createPortal(children, document.body);
}

function MoveTaskModal({ isOpen, onClose, task, onMoveTask }) {
  if (!isOpen) return null;
  
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>이 태스크를 이동하시겠습니까?</h2>
        <button onClick={onClose}>취소</button>
        <button onClick={() => onMoveTask(task)}>이동</button>
      </div>
    </div>
  );
}

export function DynamicTaskEditor({
  projectId,
  mode,
  taskToEdit,
  onDeleteSubTask,
  columnIndex,
  columnId,
  setIsAdded,
  onSave,
  onClose,
  coworkers =[],
  
}) {
   
  const loginUser = useUserStore((state) => state.user)
  const [task, setTask] = useState({
    columnId: columnId,
    id:taskToEdit?.id||"",
    title: taskToEdit?.title||"",
    content: taskToEdit?.content||"",
    priority: taskToEdit?.priority||5,
    duedate: taskToEdit?.duedate||"",
    subTasks:taskToEdit?.subTasks||[],
    comments:taskToEdit?.comments||[],
    status: taskToEdit?.status||1,
    associate: (taskToEdit?.assign || []).map(item => item.user),
  });
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isAssoOpen, setIsAssoOpen] = useState(false);
  const textareaRef = useRef(null); // textarea에 대한 ref
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });


  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 높이를 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // scrollHeight에 맞춰 조정
    }
  }, [task.content]); // content가 변경될 때마다 높이를 조정

  // 다른 곳 클릭 시 창 닫기
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest(".relative")) {
        setIsDropdownOpen(false);
        setIsAssoOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };
  const handleTAChange = (e) => {
    e.target.style.height = 'auto'; // 초기화
    e.target.style.height = `${e.target.scrollHeight}px`;
  };
  const handleClose = () => {
    if (mode === "create") setIsAdded(false);
    else if (mode === "edit") onClose();
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(task)
    if (task.title.trim() === "") return;
    onSave(task, columnIndex);
    if (mode === "create") setIsAdded(false);
  };
  const getPosition = (event) =>{
    const rect = event.currentTarget.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
  }
  const toggleDropdown = (e) => {getPosition(e);setIsDropdownOpen(!isDropdownOpen)};
  const toggleAsso = (e) => {getPosition(e);setIsAssoOpen(!isAssoOpen)};

  const handlePrioritySelect = (priority) => {
    setTask((prevTask) => ({ ...prevTask, priority:priority.id }));
    console.log(task);
    setIsDropdownOpen(false);
  };
// 멤버 클릭 핸들러 (토글 방식)
const handleMemberClick = (member) => {
  console.log(member)
  setTask((prev) => {
    const isSelected = prev.associate.some((user) => user.id === member.id);
    const updatedCoworkers = isSelected
      ? prev.associate.filter((user) => user.id !== member.id) // 선택 해제
      : [...prev.associate, member]; // 선택 추가

      console.log(updatedCoworkers)
    return {
      ...prev,
      associate: updatedCoworkers,
    };
  });
};

// 멤버 삭제 핸들러
const handleDeleteTag = (index) => {
  setTask((prev) => ({
    ...prev,
    associate: prev.associate.filter((_, i) => i !== index),
  }));
};
  const priorities = [
    { id: "p0", label: "P0 - 아주 높음" },
    { id: "p1", label: "P1 - 높음" },
    { id: "p2", label: "P2 - 보통" },
    { id: "p3", label: "P3 - 낮음" },
    { id: "p4", label: "P4 - 아주 낮음" },
    { id: "none", label: "none" },
  ];

  const colClassName =
    "flex gap-1.5 items-start pt-1.5 mt-1.5 max-w-full tracking-normal leading-none rounded-lg min-h-[26px] text-gray-600/60 w-[231px]";

  const ProfileURI = PROFILE_URI;
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col mt-3 w-full text-sm relative"
      aria-labelledby="new-task-form"
    >
      <div className="flex gap-2 items-start p-3 pt-2 w-full bg-white rounded-lg border border-solid shadow-sm border-black/10 overflow-visible">
        <div className="flex flex-col flex-1 shrink w-full basis-0 overflow-visible">
          {/* Task Name */}
          
          <label htmlFor="taskName" className="sr-only">
            Task Name
          </label>
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-1 shrink basis-0 text-sm"
                onClick={toggleDropdown}
                aria-haspopup="listbox"
                aria-expanded={isDropdownOpen}
                aria-label="Select priority"
                title="중요도 수정">
              <CustomSVG
                  id={
                    task.priority === "none"
                      ? "bar-chart"
                      : task.priority
                  }
                />
                {isDropdownOpen && (
              <ul
                className="absolute mt-7 w-36 py-2 bg-white border rounded shadow-md z-30"
                role="listbox"
                aria-labelledby="priority-dropdown"
              >
                {priorities.map((priority) => (
                  <li
                    key={priority.id}
                    className="flex items-center gap-2 px-3 h-6 text-xs hover:bg-gray-100 cursor-pointer"
                    onClick={() => handlePrioritySelect(priority)}
                    role="option"
                    aria-selected={task.priority === priority.id}
                  >
                    <CustomSVG id={priority.id} />
                    <span>{priority.label}</span>
                  </li>
                ))}
              </ul>
            )}
            </div>
            <input
              autoFocus
              id="taskName"
              type="text"
              name="title"
              value={task.title}
              onChange={handleInputChange}
              placeholder="이름을 입력하세요"
              className="flex flex-col max-w-full tracking-normal leading-6 rounded-lg min-h-[26px] text-gray-800/80 text-sm w-[198px]"
              aria-label="Task name"
            />
            <button onClick={handleClose} aria-label="Close form" type="button">
              <CustomSVG id="close" />
            </button>
          </div>

          {/* Task Details */}
          <div className={colClassName}>
            <CustomSVG id="post-add" />
            <textarea
              id="taskDetails"
              name="content"
              value={task.content}
              onChange={(e)=>{handleInputChange(e);handleTAChange(e)}}
              placeholder="세부 내용 입력"
              className="flex flex-col flex-1 shrink basis-0 text-sm"
              ref={textareaRef}
              aria-label="Task contents"
            />
          </div>
          
          {/* 작업자 */}
          <section
              className="relative flex flex-wrap items-center space-x-2 gap-2 mt-1.5 text-sm text-black/50 overflow-visible"
              aria-labelledby="associate"
            >
                <span onClick={toggleAsso}>작업자</span> 
              <div className="relative flex items-center">
                {task.associate.map((user, index) => (
                  <span
                    key={user.id}
                    className="flex items-center flex-shrink-0 gap-[2px] px-2 py-[2px] rounded-2xl bg-indigo-200/70 text-xs text-indigo-500"
                  >
                    <img src={user.profile!=null?ProfileURI+user.profile:"/images/user_face_icon.png"}
                               className="h-[24px] w-[24px] object-cover rounded-full" />
                    <span className="">{user.name}</span>
                    <span className="text-indigo-400">({user?.group})</span>
                    <button onClick={() => handleDeleteTag(index)}>
                      <CustomSVG id="cancel" color="#666CFF" />
                    </button>
                  </span>
                ))}
                
              </div>
              {isAssoOpen && (
                <Portal>
                  <ul
                      className="absolute w-36 py-2 bg-white border rounded shadow-md z-30"
                      role="listbox"
                      aria-labelledby="associate-dropdown"
                      style={{top: dropdownPosition.top, left: dropdownPosition.left,}}
                    >
                      {coworkers.map((m) => (
                                <li
                                  key={m?.id}
                                  onClick={() => handleMemberClick(m)}
                                  className={`rounded-3xl px-3 py-1 flex mt-2 cursor-pointer border border-transparent ${
                                    task.associate.some((asso) => asso.id === m.id)
                                      ? "bg-indigo-100 hover:border-indigo-300"
                                      : "bg-gray-100 hover:border-gray-300"}`}>
                                  <img
                                    src={m.profile!=null?ProfileURI+m.profile:"/images/user_face_icon.png"}
                                    alt="user-img"
                                    className="w-[20px] h-[20px] rounded-full object-cover"
                                  />
                                  <div className="ml-10 flex flex-col text-left">
                                    <span className="font-light text-black text-xs">
                                      {m?.name}{m?.id == loginUser.id&&" (본인)"}
                                    </span>
                                  </div>
                                </li>
                          ))}
                    </ul>
                </Portal>
                    
                  )}
            </section>
          {/* 마감일 */}
          <div className={colClassName+' relative'}>
            <CustomSVG id="calendar" />
            <h2 id="taskDate" className="sr-only">
            마감일
            </h2>
            <input
              id="taskDate"
              type="date"
              name="duedate"
              value={task.duedate}
              onChange={handleInputChange}
              min="2020-01-01"
              max="9999-12-31"
              aria-label="마감일"
            />
          </div>
          {/* SubTasks Section */}
          <section
            className="flex flex-col mt-1.5"
            aria-labelledby="subtasks-title"
          >
            <h2 id="subtasks-title" className="sr-only">
              하위 목표
            </h2>
            {task.subTasks.map((subTask, index) => (
              <div
                key={subTask.id}
                className="flex items-center gap-1.5 h-[22px]"
              >
                <input
                  id={`check${index}`}
                  checked={subTask.isChecked}
                  type="checkbox"
                  className="screen-reader"
                  aria-checked={subTask.isChecked}
                />
                <label
                  aria-label={`하위목표 - ${subTask.name}`}
                  htmlFor={`check${index}`}
                  className="flex flex-row items-center gap-1 text-neutral-500 text-sm"
                >
                  <CustomSVG
                    id={subTask.isChecked ? "checkbox-checked" : "checkbox"}
                    color={subTask.isChecked ? "#A2A2E6" : "#8A8AE2"}
                  />
                  {subTask.name}
                </label>
                <button
                    onClick={() => {onDeleteSubTask(subTask)}}
                    aria-label="Delete SubTask"
                    className="ml-auto text-sm"
                  >
                    <CustomSVG id="cancel" />
                </button>
              </div>
            ))}
          </section>
          

          {/* Submit Button */}
          <div className="flex overflow-hidden flex-wrap gap-2 items-start mt-2 w-full">
            <button
              type="submit"
              className="flex grow shrink justify-center items-start font-medium tracking-wide leading-6 uppercase whitespace-nowrap text-zinc-700 w-[214px]"
              aria-label="Submit task"
              onClick={handleSubmit}
            >
              <span className="flex overflow-hidden flex-col justify-center items-center rounded-lg border border-solid border-zinc-700/50">
                <span className="overflow-hidden px-6 py-1 max-md:px-5">
                  {mode === "edit" ? "수정" : "저장"}
                </span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}